import { bindActionCreators } from '/libraries/redux/src/index.js';
import Account from './accounts/account.js';
import * as AccountType from './accounts/account-type.js';
import accountStore from './accounts/account-store.js';
import store from './store/store.js';
import { addVolatile, clearVolatile, persist } from './store/accounts.js';
import { clear as clearUserInputs } from './store/user-inputs.js';
import XRouter from '/elements/x-router/x-router.js';

export default class KeyguardApi {

    static get satoshis() { return 1e5 }

    constructor() {
        this.actions = bindActionCreators({
            addVolatile,
            clearVolatile,
            persist,
            clearUserInputs,
        }, store.dispatch);
    }

    /*
     triggerImport
     sign
     */

    // dummy
    async get() {
        const accounts = await accountStore.list();
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
            const account = new Account(keyPair);

            this.actions.addVolatile(account);
        }

        const accounts = store.getState().accounts.volatileAccounts;

        const publicKeys = [...accounts].map(([key, value]) => ([key, {
            publicKey: value.keyPair.publicKey
        }]));

        localStorage.setItem('volatiles', JSON.stringify(publicKeys));

        return [...accounts.keys()]
    }

    async persist(userFriendlyAddress, accountType) {

        const storedVolatiles = new Map(JSON.parse(localStorage.getItem('volatiles')));

        const account = storedVolatiles.get(userFriendlyAddress);

        if (!account) throw new Error('Account not found');

        this.actions.persist(userFriendlyAddress);

        const password = await new Promise((resolve, reject) => {

            store.subscribe(state => {
                const passwordFromUI = state.userInputs.password;
                const confirmed = state.userInputs.confirmed;

                if (passwordFromUI) {
                    this.actions.clearUserInputs();
                    resolve(passwordFromUI);
                }

                if (confirmed === false) {
                    this.actions.clearUserInputs();
                    reject('User denied action');
                }
            });

            XRouter.root.goTo('persist');
        });

        // encypt password with public key and send it per local storage to iframe

        // todo encrypt

        localStorage.setItem('persist', JSON.stringify({
            userFriendlyAddress: account.userFriendlyAddress,
            password,
            accountType
        }));
    }

    async persistWithPin(userFriendlyAddress, pin) {

        const account = store.getState().accounts.volatileAccounts.get(userFriendlyAddress);

        if (!account) throw new Error('Account not found');

        account._type = AccountType.low;

        // todo encrypt key with pin

        if (!await accountStore.put(account)) {
            throw new Error('Account could not be persisted');
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
        const account = new Account(keyPair);
        if (persist) {
            await accountStore.put(account);
        }
        return account.userFriendlyAddress;
    }

    async lock(accountNumber, pin) {
        const account = accountStore.get(accountNumber);
        return account.lock(pin);
    }

    async unlock(accountNumber, pin) {
        const account = accountStore.get(accountNumber);
        return account.unlock(pin);
    }

    async importEncrypted(encryptedKey, password, persist = true) {
        encryptedKey = Nimiq.BufferUtils.fromBase64(encryptedKey);
        const account = Account.loadEncrypted(encryptedKey, password);
        if (persist) {
            accountStore.put(account);
        }
        return account.userFriendlyAddress;
    }

    async exportEncrypted(password) {
        const exportedWallet = Account.exportEncrypted(password);
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