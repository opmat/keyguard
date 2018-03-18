import Key from './key.js';

class KeyStore {

    static get instance() {
        this._instance = this._instance || new KeyStore();
        return this._instance;
    }

    /**
     * @constructor
     */
    constructor(dbName = 'accounts') {
        this._dbInitialized = new Promise((resolve, reject) => {
            const request = self.indexedDB.open(dbName, KeyStore.VERSION);

            request.onerror = () => reject(request.error);

            request.onupgradeneeded = () => {
                this._db = request.result;

                this._db.createObjectStore(KeyStore.ACCOUNT_DATABASE, { keyPath: 'userFriendlyAddress' });

                // todo later
                this._multiSigStore = null;
            };

            request.onsuccess = () => {
                this._db = request.result;
                resolve();
            }
        });
    }

    _getStore(storeName, mode) {
        return new Promise(async (resolve, reject) => {
            await this._dbInitialized;

            const transaction = this._db.transaction([storeName], mode)

            transaction.onerror = () => reject(transaction.error);

            resolve(transaction.objectStore(storeName));
        });
    }

    _getResult(request) {
        return new Promise (async (resolve, reject)=> {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    get _keyStoreRead() {
        return this._getStore(KeyStore.ACCOUNT_DATABASE, 'readonly');
    }

    get _keyStoreWrite() {
        return this._getStore(KeyStore.ACCOUNT_DATABASE, 'readwrite');
    }

    /**
     * @param {string} userFriendlyAddress
     * @param {Uint8Array|string} passphrase
     * @returns {Promise.<Key>}
     */
    async get(userFriendlyAddress, passphrase) {
        await this._dbInitialized;
        const request = (await this._keyStoreRead).get(userFriendlyAddress);
        const key = await this._getResult(request);

        return Key.loadEncrypted(key.encryptedKeyPair, passphrase);
    }

    /**
     * @param {string} userFriendlyAddress
     * @returns {Promise.<object>}
     */
    async getPlain(userFriendlyAddress) {
        await this._dbInitialized;
        const request = (await this._keyStoreRead).get(userFriendlyAddress);
        return await this._getResult(request);
    }

    /**
     * @param {Key} key
     * @param {Uint8Array|string} [passphrase]
     * @param {Uint8Array|string} [unlockKey]
     * @returns {Promise}
     */
    async put(key, passphrase, unlockKey) {
        await this._dbInitialized;

        /** @type {Uint8Array} */
        const encryptedKeyPair = await key.exportEncrypted(passphrase, unlockKey);

        const request = (await this._keyStoreWrite).put({
            encryptedKeyPair: encryptedKeyPair,
            userFriendlyAddress: key.userFriendlyAddress,
            type: key.type,
            label: key.label,
        });

        return await this._getResult(request);
    }

    /**
     * @param {Address} address
     * @returns {Promise}
     */
    async remove(address) {
        await this._dbInitialized;

        const request = (await this._keyStoreWrite).remove(address);

        return await this._getResult(request);
    }

    /**
     * @returns {Address[]}
     */
    async list() {
        await this._dbInitialized;

        const request = (await this._keyStoreRead).getAll();

        const keys = await this._getResult(request);

        // Because: To use Key.getPublicInfo(), we would need to create Key instances out of the key object that we receive from the DB
        const result = [...keys].map(key => ({
            address: key.userFriendlyAddress,
            type: key.type,
            label: key.label
        }));

        return result;
    }

    /**
     * After account was successfully backuped, allow its use
     *
     * @param userFriendlyAddress
     * @return {Promise<void>}
     */
    async activate(userFriendlyAddress) {
        // todo implement
    }

    /**
     * @param {Address} address
     * @param {Uint8Array|string} [key]
     * @returns {Promise.<MultiSigWallet>}
     */
    /*async getMultiSig(address, key) {
        await this._dbInitialized;
        const base64Address = address.toBase64();
        const buf = await this._multiSigStore.get(base64Address);
        if (key) {
            return MultiSigWallet.loadEncrypted(buf, key);
        }
        return MultiSigWallet.loadPlain(buf);
    }*/

    /**
     * @param {MultiSigWallet} wallet
     * @param {Uint8Array|string} [key]
     * @param {Uint8Array|string} [unlockKey]
     * @returns {Promise}
     */
    /*async putMultiSig(wallet, key, unlockKey) {
        await this._dbInitialized;
        const base64Address = wallet.address.toBase64();
        /** @type {Uint8Array} */
        /*let buf = null;
        if (key) {
            buf = await wallet.exportEncrypted(key, unlockKey);
        } else {
            buf = wallet.exportPlain();
        }
        return this._multiSigStore.put(base64Address, buf);
    }*/

    /**
     * @param {Address} address
     * @returns {Promise}
     */
    /*async removeMultiSig(address) {
        await this._dbInitialized;
        const base64Address = address.toBase64();
        return this._multiSigStore.remove(base64Address);
    }*/

    /**
     * @returns {Promise<Array.<Address>>}
     */
    /*async listMultiSig() {
        await this._dbInitialized;
        const keys = await this._multiSigStore.keys();
        return Array.from(keys).map(key => Nimiq.Address.fromBase64(key));
    }*/

    close() {
        return this._db.close();
    }
}

KeyStore.VERSION = 2;
KeyStore.ACCOUNT_DATABASE = 'accounts';
KeyStore.MULTISIG_WALLET_DATABASE = 'multisig-wallets';

export default KeyStore.instance;
