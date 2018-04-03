import Key from './key.js';

class KeyStore {

    static get instance() {
        this._instance = this._instance || new KeyStore();
        return this._instance;
    }

    /**
     * @param {string} dbName
     * @constructor
     */
    constructor(prefix = 'keyguard_') {
        this._prefix = prefix;
    }

    /**
     * @param {string} userFriendlyAddress
     * @returns {Promise.<object>}
     */
    async getPlain(userFriendlyAddress) {
        const key = JSON.parse(localStorage.getItem(`${this._prefix}${userFriendlyAddress}`));
        key.encryptedKeyPair = new Uint8Array(key.encryptedKeyPair);

        return key;
    }

    /**
     * @param {string} userFriendlyAddress
     * @param {Uint8Array|string} passphrase
     * @returns {Promise.<Key>}
     */
    async get(userFriendlyAddress, passphrase) {
        const key = await this.getPlain(userFriendlyAddress);
        const result = await Key.loadEncrypted(key.encryptedKeyPair, passphrase);
        result.type = key.type;
        result.label = key.label;

        return result;
    }

    /**
     * @param {Key} key
     * @param {Uint8Array|string} [passphrase]
     * @param {Uint8Array|string} [unlockKey]
     * @returns {Promise}
     */
    async put(key, passphrase, unlockKey) {
        /** @type {Uint8Array} */
        const encryptedKeyPair = await key.exportEncrypted(passphrase, unlockKey);

        const keyInfo = {
            encryptedKeyPair: encryptedKeyPair,
            userFriendlyAddress: key.userFriendlyAddress,
            type: key.type,
            label: key.label
        };

        return this.putPlain(keyInfo);
    }

    /**
     * @param {object} keyInfo
     * @returns {Promise}
     */
    async putPlain(keyInfo) {
        keyInfo.encryptedKeyPair = [...keyInfo.encryptedKeyPair];

        try {
            localStorage.setItem(`${this._prefix}${keyInfo.userFriendlyAddress}`, JSON.stringify(keyInfo));
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    /**
     * @param {string} userFriendlyAddress
     * @returns {Promise}
     */
    async remove(userFriendlyAddress) {
        return localStorage.removeItem(`${this._prefix}${userFriendlyAddress}`);
    }

    /**
     * @returns {Promise.<Array.<object>>}
     */
    async list() {
        const storageKeys = Object.keys(localStorage).filter(key => key.startsWith(`${this._prefix}`));

        const keys = await Promise.all(storageKeys.map(storageKey => this.getPlain(storageKey.replace(`${this._prefix}`, ''))));

        return keys.map(key => {
            return {
                address: key.userFriendlyAddress,
                type: key.type,
                label: key.label
            }
        });
    }

    /**
     * After account was successfully backuped, allow its use
     *
     * @param userFriendlyAddress
     * @return {Promise<void>}
     */
    async activate(userFriendlyAddress) {
        // TODO: implement
    }

    close() {
        return true;
    }
}

export default KeyStore.instance;
