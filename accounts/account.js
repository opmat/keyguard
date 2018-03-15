export default class Account {
    /**
     * @param {Uint8Array|string} buf
     * @return {Account}
     */
    static loadPlain(buf) {
        if (typeof buf === 'string') buf = Nimiq.BufferUtils.fromHex(buf);
        if (!buf || buf.byteLength === 0) {
            throw new Error('Invalid Account seed');
        }
        return new Account(Nimiq.KeyPair.unserialize(new Nimiq.SerialBuffer(buf)));
    }

    /**
     * @param {Uint8Array|string} buf
     * @param {Uint8Array|string} password
     * @return {Promise.<Account>}
     */
    static loadEncrypted(buf, password) {
        if (typeof buf === 'string') buf = Nimiq.BufferUtils.fromHex(buf);
        if (typeof password === 'string') password = Nimiq.BufferUtils.fromAscii(password);
        return new Account(Nimiq.KeyPair.fromEncrypted(new Nimiq.SerialBuffer(buf), password));
    }

    /**
     * Create a new Account object.
     * @param {KeyPair} keyPair KeyPair owning this Account
     * @returns {Account} A newly generated Account
     */
    constructor(keyPair, type, label) {
        /** @type {KeyPair} */
        this._keyPair = keyPair;
        /** @type {Address} */
        this.address = this._keyPair.publicKey.toAddress();
        this.userFriendlyAddress = this.address.toUserFriendlyAddress();
        this.type = type;
        this.label = label;
    }

    static _isTransaction() {
        // todo implement
    }

    /** Sign a generic message */
    sign(message) {
        if (this._isTransaction(message)) {
            // todo implement
            this.signTransaction(message);
        } else {
           return Nimiq.Signature.create(this._keyPair.privateKey, this._keyPair.publicKey, message);
        }
    }

    /**
     * Sign Transaction that is signed by the owner of this Account
     * @param {Address} recipient Address of the transaction receiver
     * @param {number} value Number of Satoshis to send.
     * @param {number} fee Number of Satoshis to donate to the Miner.
     * @param {number} validityStartHeight The validityStartHeight for the transaction.
     * @returns {Transaction} A prepared and signed Transaction object. This still has to be sent to the network.
     */
    createTransaction(recipient, value, fee, validityStartHeight) {
        const transaction = new BasicTransaction(this._keyPair.publicKey, recipient, value, fee, validityStartHeight);
        transaction.signature = Nimiq.Signature.create(this._keyPair.privateKey, this._keyPair.publicKey, transaction.serializeContent());
        return transaction;
    }

    /**
     * @returns {Uint8Array}
     */
    exportPlain() {
        return this._keyPair.serialize();
    }

    /**
     * @param {Uint8Array|string} key
     * @param {Uint8Array|string} [unlockKey]
     * @return {Promise.<Uint8Array>}
     */
    exportEncrypted(key, unlockKey) {
        if (typeof key === 'string') key = Nimiq.BufferUtils.fromAscii(key);
        if (typeof unlockKey === 'string') unlockKey = Nimiq.BufferUtils.fromAscii(unlockKey);
        return this._keyPair.exportEncrypted(key, unlockKey);
    }

    /** @type {boolean} */
    get isLocked() {
        return this.keyPair.isLocked;
    }

    /**
     * @param {Uint8Array|string} key
     * @returns {Promise.<void>}
     */
    lock(key) {
        if (typeof key === 'string') key = Nimiq.BufferUtils.fromAscii(key);
        return this.keyPair.lock(key);
    }

    relock() {
        this.keyPair.relock();
    }

    /**
     * @param {Uint8Array|string} key
     * @returns {Promise.<void>}
     */
    unlock(key) {
        if (typeof key === 'string') key = Nimiq.BufferUtils.fromAscii(key);
        return this.keyPair.unlock(key);
    }

    /**
     * @param {Account} o
     * @return {boolean}
     */
    equals(o) {
        return o instanceof Account && this.keyPair.equals(o.keyPair) && this.address.equals(o.address);
    }

    /**
     * The public key of the Account owner
     * @type {PublicKey}
     */
    get publicKey() {
        return this._keyPair.publicKey;
    }

    /** @type {KeyPair} */
    get keyPair() {
        return this._keyPair;
    }
}
