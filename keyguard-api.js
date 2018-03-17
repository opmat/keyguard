import { bindActionCreators } from '/libraries/redux/src/index.js';
import Key from './keys/key.js';
import * as AccountType from './keys/keytype.js';
import keyStore from './keys/keystore.js';
import store from './store/store.js';
import { createVolatile, clearVolatile } from './store/keys.js';
import { start } from './store/request.js';
import XRouter from '/elements/x-router/x-router.js';
import { RequestTypes } from './store/request.js';

export default class KeyguardApi {

    static get satoshis() { return 1e5 }

    constructor() {
        this.actions = bindActionCreators({
            createVolatile,
            clearVolatile,
            start,
        }, store.dispatch);
    }

    _startRequest(requestType) {
        return new Promise((resolve, reject) => {

            if (store.getState().request.started) {
                throw new Error('Request already started');
            }

            this.actions.start(requestType);

            // wait until the ui dispatches the user's feedback
            store.subscribe(() => {
                const request = store.getState().request;

                if (!request.completed && !request.error) return;

                if (request.confirmed) {
                    // return created key
                    resolve(request.result);
                } else if(request.error) {
                    reject(new Error(request.error));
                } else {
                    //user denied
                    resolve(null);
                }
            });

            XRouter.root.goTo(requestType);
        });
    }

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

    // for wallet
    createVolatile(number) {

        this.actions.clearVolatile();

        for (let i = 0; i < number; i++) {
            const keyPair = Nimiq.KeyPair.generate();
            const account = new Key(keyPair);

            this.actions.addVolatile(account);
        }

        const accounts = store.getState().accounts.volatileKeys;

        const publicKeys = [...accounts].map(([address, account]) => ([address, {
            publicKey: account.keyPair.publicKey,
        }]));

        localStorage.setItem(KeyguardApi.VOLATILES, JSON.stringify(publicKeys));

        return [...accounts.keys()];
    }

    // for safe
    async create() {
        return this._startRequest(RequestTypes.CREATE);
    }

    async signTransaction(sender, recipient, amount, fee) {
        return this._startRequest(RequestTypes.SIGN_TRANSACTION, {
            sender,
            recipient,
            amount,
            fee
        });
    }

    // for wallet
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
