import { bindActionCreators } from '/libraries/redux/src/index.js';
import ValidationUtils from '/libraries/secure-utils/validation-utils/validation-utils.js';
import KeyType from '../keys/key-type.js';
import keyStore from '../keys/key-store.js';
import store from '../store.js';
import { createVolatile, clearVolatile } from '../keys/keys-redux.js';
import { start, loadAccountData } from './request-redux.js';
import XRouter from '/secure-elements/x-router/x-router.js';
import { RequestTypes } from './request-redux.js';

export default class KeyguardApi {

    static get satoshis() { return 1e5 }

    constructor() {
        this.actions = bindActionCreators({
            createVolatile,
            clearVolatile,
            start,
            loadAccountData
        }, store.dispatch);
    }

    /** WITHOUT UI */

    async list() {
        const keys = await keyStore.list();
        return keys;
    }

    async getDefaultAccount() {
        const keys = await this.list();

        const firstSafeKey = keys.find(key => key.type === KeyType.HIGH);
        if (firstSafeKey) return firstSafeKey;

        // Return first Wallet key or NULL
        return keys.find(key => key.type === KeyType.LOW) || null;
    }

    /*createVolatile(number) {

        this.actions.clearVolatile();

        this.actions.createVolatile(number);

        const keys = store.getState().keys.volatileKeys;

        return [...keys.keys()]; // = addresses
    }

    async persistWithPin(userFriendlyAddress, pin) {

        const key = store.getState().keys.volatileKeys.get(userFriendlyAddress);

        if (!key) throw new Error('Key not found');

        key._type = KeyType.low;

        if (!await keyStore.put(key, pin)) {
            throw new Error('Key could not be persisted');
        }

        return true;
    }*/

    /*async lock(userFriendlyAddress, pin) {
        const key = keyStore.get(userFriendlyAddress);
        return key.lock(pin);
    }

    async unlock(userFriendlyAddress, pin) {
        const key = keyStore.get(userFriendlyAddress);
        return key.unlock(pin);
    }*/

    /** WITH UI */

    /** Set request state to started and wait for UI to set the result
     *
     * @param { RequestType} requestType
     * @param { Object } data - additional request data
     * @return {Promise<any>} - answer for calling app
     * @private
     */
    _startRequest(requestType, data = {}) {
        return new Promise((resolve, reject) => {

            // only one request at a time
            if (store.getState().request.requestType) {
                throw new Error('Request already started');
            }

            // open corresponding UI
            XRouter.create(requestType);

            // Set request state to started. Save reject so we can cancel the request when the window is closed
            this.actions.start(requestType, reject, data);

            // load account data, if we already know the account this request is about
            if (data.address) {
                this.actions.loadAccountData(requestType);
            }

            // wait until the ui dispatches the user's feedback
            store.subscribe(() => {
                const request = store.getState().request;

                if (request.error) {
                    reject(request.error);
                    self.close();
                }

                if (request.result) {
                    resolve(request.result);
                }
            });
        });
    }

    async createSafe() {
        return this._startRequest(RequestTypes.CREATE_SAFE);
    }

    async createWallet() {
        return this._startRequest(RequestTypes.CREATE_WALLET);
    }

    // todo later: test if transaction or generic message and react accordingly
    /*async sign(message) {
        const {sender, recipient, value, fee} = message;
        const signature = 'mySign';
        return signature;
    }*/

    async signSafe(transaction) {
        const key = await keyStore.getPlain(transaction.sender);
        if (key.type !== KeyType.HIGH) throw new Error('Unauthorized: sender is not a Safe account');

        transaction.value = Math.round(transaction.value * KeyguardApi.satoshis);
        transaction.fee = Math.round(transaction.fee * KeyguardApi.satoshis);

        return this._startRequest(RequestTypes.SIGN_SAFE_TRANSACTION, {
            transaction,
            address: transaction.sender // for basic transactions, todo generalize
        });
    }

    async signWallet(transaction) {
        const key = await keyStore.getPlain(transaction.sender);
        if (key.type !== KeyType.LOW) throw new Error('Unauthorized: sender is not a Wallet account');

        transaction.value = Math.round(transaction.value * KeyguardApi.satoshis);
        transaction.fee = Math.round(transaction.fee * KeyguardApi.satoshis);

        return this._startRequest(RequestTypes.SIGN_WALLET_TRANSACTION, {
            transaction,
            address: transaction.sender // for basic transactions, todo generalize
        });
    }

    importFromFile() {
        return this._startRequest(RequestTypes.IMPORT_FROM_FILE);
    }

    importFromWords() {
        return this._startRequest(RequestTypes.IMPORT_FROM_WORDS);
    }

    backupFile(address) {
        if (!ValidationUtils.isValidAddress(address)) return;

        return this._startRequest(RequestTypes.BACKUP_FILE, {
            address
        });
    }

    backupWords(address) {
        if (!ValidationUtils.isValidAddress(address)) return;

        return this._startRequest(RequestTypes.BACKUP_WORDS, {
            address
        });
    }

    rename(address) {
        if (!ValidationUtils.isValidAddress(address)) return;

        return this._startRequest(RequestTypes.RENAME, {
            address
        });
    }
}
