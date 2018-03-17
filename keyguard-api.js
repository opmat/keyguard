import { bindActionCreators } from '/libraries/redux/src/index.js';
import Key from './keys/key.js';
import * as AccountType from './keys/keytype.js';
import keyStore from './keys/keystore.js';
import store from './store/store.js';
import { addVolatile, clearVolatile, requestPersist } from './store/keys.js';
import { clear as clearUserInputs } from './store/user-inputs.js';
import XRouter from '/elements/x-router/x-router.js';

export default class KeyguardApi {

    static get satoshis() { return 1e5 }

    constructor() {
        this.actions = bindActionCreators({
            addVolatile,
            clearVolatile,
            requestPersist,
            clearUserInputs,
        }, store.dispatch);
    }

    /*
     triggerImport
     sign
     */

    // dummy
    async get() {
        const accounts = await keyStore.list();
        return accounts;
    }

    importAccount() {
        //router.navigate('import');
    }

    exportAccount(accountNumber) {
        /*state.exportAccount.number = accountNumber;
        state.exportAccount.promise = new Promise((resolve) => {
            state.exportAccount.resolve = resolve;
        });*/
        //Router.navigate(`export/${accountNumber}`);
    }

    // dummy
    // todo test if transaction or generic message
    async sign({sender, recipient, value, fee}) {
        const signature = 'mySign';
        return signature;
    }

    createVolatile(number) {

        this.actions.clearVolatile();

        for (let i = 0; i < number; i++) {
            const keyPair = Nimiq.KeyPair.generate();
            const account = new Key(keyPair);

            this.actions.addVolatile(account);
        }

        const accounts = store.getState().accounts.volatileKeys;

        const publicKeys = [...accounts].map(([key, value]) => ([key, {
            publicKey: value.keyPair.publicKey,

        }]));

        localStorage.setItem(KeyguardApi.VOLATILES, JSON.stringify(publicKeys));

        return [...accounts.keys()]
    }

    async persist(userFriendlyAddress, accountType) {

        const storedVolatiles = new Map(JSON.parse(localStorage.getItem(KeyguardApi.VOLATILES)));

        localStorage.removeItem(KeyguardApi.VOLATILES);

        const account = storedVolatiles.get(userFriendlyAddress);

        if (!account) throw new Error('Key not found');

        this.actions.requestPersist(userFriendlyAddress);


        // todo get both password and label (const [password, label] = ...)
        const password = await new Promise((resolve, reject) => {

            // wait until the ui dispatches the user's feedback
            store.subscribe(() => {
                const state = store.getState();

                const passwordFromUI = state.userInputs.password;
                const confirmed = state.userInputs.confirmed;

                if (confirmed && passwordFromUI) {
                    this.actions.clearUserInputs();
                    resolve(passwordFromUI);
                }

                if (confirmed === false) {
                    this.actions.clearUserInputs();
                    reject(new Error('User denied action'));
                }
            });

            XRouter.root.goTo('persist');
        });

        // todo encypt password with public key

        // wait for response from iframe...
        const response = new Promise(resolve => {
            const listener = ({ key, newValue }) => {
                if (key !== KeyguardApi.PERSIST_RESPONSE || newValue === '') return;
                self.removeEventListener('storage', listener);
                localStorage.removeItem(KeyguardApi.PERSIST_RESPONSE);
                resolve(newValue);
            }

            self.addEventListener('storage', listener);

            // ...to this request
            localStorage.setItem(KeyguardApi.PERSIST, JSON.stringify({
                userFriendlyAddress,
                password,
                accountType,
            }));
        });

        // return 0=false or 1=true
        return parseInt(await response);
    }

    async persistWithPin(userFriendlyAddress, pin) {

        const account = store.getState().accounts.volatileKeys.get(userFriendlyAddress);

        if (!account) throw new Error('Key not found');

        account._type = AccountType.low;

        // todo encrypt key with pin

        if (!await keyStore.put(account)) {
            throw new Error('Key could not be persisted');
        }

        return true;
    }

    // old

    async createTransaction(recipient, value, validityStartHeight, fee = 0) {
        const recipientAddr = Nimiq.Address.fromUserFriendlyAddress(recipient);
        value = Math.round(Number(value) * KeyguardApi.satoshis);
        fee = Math.round(Number(fee) * KeyguardApi.satoshis);
        return Nimiq.wallet.createTransaction(recipientAddr, value, fee, validityStartHeight);
    }

    async import(privateKey, persist = true) {
        if(typeof privateKey ===  'string') {
            privateKey = Nimiq.PrivateKey.unserialize(Nimiq.BufferUtils.fromHex(privateKey));
        }
        const keyPair = Nimiq.KeyPair.fromPrivateKey(privateKey);
        const account = new Key(keyPair);
        if (persist) {
            await keyStore.put(account);
        }
        return account.userFriendlyAddress;
    }

    async lock(accountNumber, pin) {
        const account = keyStore.get(accountNumber);
        return account.lock(pin);
    }

    async unlock(accountNumber, pin) {
        const account = keyStore.get(accountNumber);
        return account.unlock(pin);
    }

    async importEncrypted(encryptedKey, password, persist = true) {
        encryptedKey = Nimiq.BufferUtils.fromBase64(encryptedKey);
        const account = Key.loadEncrypted(encryptedKey, password);
        if (persist) {
            keyStore.put(account);
        }
        return account.userFriendlyAddress;
    }

    async exportEncrypted(password) {
        const exportedWallet = Key.exportEncrypted(password);
        return Nimiq.BufferUtils.toBase64(exportedWallet);
    }

    /** @param {string} friendlyAddress */
    async getUnfriendlyAddress(friendlyAddress) {
        return Nimiq.Address.fromUserFriendlyAddress(friendlyAddress);
    }

    static validateAddress(address) {
        try {
            this.isUserFriendlyAddress(address);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Copied from: https://github.com/nimiq-network/core/blob/master/src/main/generic/consensus/base/account/Address.js

    static isUserFriendlyAddress(str) {
        str = str.replace(/ /g, '');
        if (str.substr(0, 2).toUpperCase() !== 'NQ') {
            throw new Error('Addresses start with NQ', 201);
        }
        if (str.length !== 36) {
            throw new Error('Addresses are 36 chars (ignoring spaces)', 202);
        }
        if (this._ibanCheck(str.substr(4) + str.substr(0, 4)) !== 1) {
            throw new Error('Address Checksum invalid', 203);
        }
    }

    static _ibanCheck(str) {
        const num = str.split('').map((c) => {
            const code = c.toUpperCase().charCodeAt(0);
            return code >= 48 && code <= 57 ? c : (code - 55).toString();
        }).join('');
        let tmp = '';

        for (let i = 0; i < Math.ceil(num.length / 6); i++) {
            tmp = (parseInt(tmp + num.substr(i * 6, 6)) % 97).toString();
        }

        return parseInt(tmp);
    }
}

KeyguardApi.PERSIST = 'persist';
KeyguardApi.PERSIST_RESPONSE = 'persistResponse';
KeyguardApi.VOLATILES = 'volatiles';