import AccountStore from './wip/account-store.js';

export default class KeystoreApi {

    static get satoshis() { return 1e5 }

    constructor() {
        this.$ = Nimiq;
        this._accountStore = new AccountStore();
    }

    /*
    Accounts listing
    Volatile Account creation
    Persist Account -> storing
    Import Account -> storing
    Store Account
    Transaction Signing
     */

    // dummy
    async getAddresses() {
        return ['wff']
        const accounts = await this._accountStore.list();
        return accounts.map(account => {
            account
        });
    }

    // dummy
    async sign(sender, recipient, value, fee) {
        const signature = 'mySign';
        return signature;
        // TODO: Either create transaction here, or ACL has to know how to get value out of Transaction.
    }


    async createTransaction(recipient, value, validityStartHeight, fee = 0) {
        const recipientAddr = Nimiq.Address.fromUserFriendlyAddress(recipient);
        value = Math.round(Number(value) * KeystoreApi.satoshis);
        fee = Math.round(Number(fee) * KeystoreApi.satoshis);
        return this.$.wallet.createTransaction(recipientAddr, value, fee, validityStartHeight);
    }

    get address() {
        return this.$.wallet.address.toUserFriendlyAddress();
    }

    async generateKeyPair() {
        return Nimiq.KeyPair.generate();
    }

    async importKey(privateKey, persist = true) {
        if(typeof privateKey ===  'string') {
            privateKey = Nimiq.PrivateKey.unserialize(Nimiq.BufferUtils.fromHex(privateKey));
        }
        const keyPair = Nimiq.KeyPair.fromPrivateKey(privateKey);
        this.$.wallet = new Nimiq.Wallet(keyPair);
        if (persist) {
            if(!this._walletStore) this.$.walletStore = await new Nimiq.WalletStore();
            await this.$.walletStore.put(this.$.wallet);
        }
        return this.address;
    }

    async exportKey() {
        return this.$.wallet.keyPair.privateKey.toHex();
    }

    async lockWallet(pin) {
        return this.$.wallet.lock(pin);
    }

    async unlockWallet(pin) {
        return this.$.wallet.unlock(pin);
    }

    async importEncrypted(encryptedKey, password, persist = true) {
        encryptedKey = Nimiq.BufferUtils.fromBase64(encryptedKey);
        this.$.wallet = await Nimiq.Wallet.loadEncrypted(encryptedKey, password);
        if (persist) {
            if(!this.$.walletStore) this.$.walletStore = await new Nimiq.WalletStore();
            await this.$.walletStore.put(this.$.wallet);
        }
        return this.address;
    }

    async exportEncrypted(password) {
        const exportedWallet = await this.$.wallet.exportEncrypted(password);
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