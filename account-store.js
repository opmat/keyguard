class AccountStore {

    static get instance() {
        this._instance = this._instance || new AccountStore();
        return this._instance;
    }

    /**
     * @constructor
     */
    constructor() {
        /** @type {Map<string, Account>} */
        this.accounts = new Map();
        /** @type {ObjectStore} */
        this._multiSigStore = null;
    }

    /**
     * @param {Address} address
     * @param {Uint8Array|string} key
     * @returns {Promise.<Wallet>}
     */
    async get(address, key) {
        const base64Address = address.toBase64();
        const buf = await this.accounts.get(base64Address);
        if (key) {
            return Nimiq.Wallet.loadEncrypted(buf, key);
        }
        return Nimiq.Wallet.loadPlain(buf);
    }

    /**
     * @param {Wallet} wallet
     * @param {Uint8Array|string} [key]
     * @param {Uint8Array|string} [unlockKey]
     * @returns {Promise}
     */
    async put(wallet, key, unlockKey) {
        const base64Address = wallet.address.toBase64();
        /** @type {Uint8Array} */
        let buf = null;
        if (key) {
            buf = await wallet.exportEncrypted(key, unlockKey);
        } else {
            buf = wallet.exportPlain();
        }
        return this.accounts.set(base64Address, buf);
    }

    /**
     * @param {Address} address
     * @returns {Promise}
     */
    async remove(address) {
        const base64Address = address.toBase64();
        // ??
        const tx = this.accounts.transaction();
        await tx.remove(base64Address);
        return tx.commit();
    }

    /**
     * @returns {Address[]}
     */
    list() {
        return [...this.accounts].map(key => Nimiq.Address.fromBase64(key));
    }

    /**
     * @param {Address} address
     * @param {Uint8Array|string} [key]
     * @returns {Promise.<MultiSigWallet>}
     */
    async getMultiSig(address, key) {
        const base64Address = address.toBase64();
        const buf = await this._multiSigStore.get(base64Address);
        if (key) {
            return MultiSigWallet.loadEncrypted(buf, key);
        }
        return MultiSigWallet.loadPlain(buf);
    }

    /**
     * @param {MultiSigWallet} wallet
     * @param {Uint8Array|string} [key]
     * @param {Uint8Array|string} [unlockKey]
     * @returns {Promise}
     */
    async putMultiSig(wallet, key, unlockKey) {
        const base64Address = wallet.address.toBase64();
        /** @type {Uint8Array} */
        let buf = null;
        if (key) {
            buf = await wallet.exportEncrypted(key, unlockKey);
        } else {
            buf = wallet.exportPlain();
        }
        return this._multiSigStore.put(base64Address, buf);
    }

    /**
     * @param {Address} address
     * @returns {Promise}
     */
    removeMultiSig(address) {
        const base64Address = address.toBase64();
        return this._multiSigStore.remove(base64Address);
    }

    /**
     * @returns {Promise<Array.<Address>>}
     */
    async listMultiSig() {
        const keys = await this._multiSigStore.keys();
        return Array.from(keys).map(key => Nimiq.Address.fromBase64(key));
    }

    close() {
        return this._jdb.close();
    }
}
AccountStore.VERSION = 2;

export default AccountStore.instance;