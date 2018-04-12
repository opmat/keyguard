import XElement from '/libraries/x-element/x-element.js';
import XRouter from '/secure-elements/x-router/x-router.js';
import XSetLabel from '/libraries/keyguard/src/common-elements/x-set-label.js';
import XDecryptSafe from './x-decrypt-safe.js';
import XDecryptWallet from './x-decrypt-wallet.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setData } from '/libraries/keyguard/src/requests/request-redux.js';
import { importFromFile as importFromFileSafe, decrypt as decryptSafe } from './actions-safe.js';
import { importFromFile as importFromFileWallet, decrypt as decryptWallet } from './actions-wallet.js';
import KeyType from '/libraries/keyguard/src/keys/key-type.js';
import XAccountBackupImport from '/secure-elements/x-account-backup-import/x-account-backup-import.js';

export default class XImportFile extends MixinRedux(XElement) {

    html() {
        return `
            <section x-route="">
                <h1>Import Access File</h1>
                <x-grow></x-grow>
                <x-account-backup-import></x-account-backup-import>
                <x-grow></x-grow>
            </section>
            <x-decrypt-safe x-route="decrypt-safe"></x-decrypt-safe>
            <x-decrypt-wallet x-route="decrypt-wallet"></x-decrypt-wallet>
            <x-set-label x-route="set-label"></x-set-label>
        `
    }

    children() {
        return [ XSetLabel, XDecryptSafe, XDecryptWallet, XAccountBackupImport ];
    }

    async onCreate() {
        super.onCreate();
        this._router = await XRouter.instance;
    }

    static mapStateToProps(state) {
        return {
            keyType: state.request.data.type
        }
    }

    static get actions() {
        return { setData, importFromFileWallet, importFromFileSafe, decryptWallet, decryptSafe };
    }

    listeners() {
        return {
            'x-read-file': this._onReadFile.bind(this),
            'x-decrypt': this._onDecrypt.bind(this),
            'x-set-label': this._onSetLabel.bind(this)
        }
    }

    _onReadFile(encryptedKeyPair64) {
        if (encryptedKeyPair64.substr(0, 2) === '#2') {
            // wallet account
            this.actions.setData(RequestTypes.IMPORT_FROM_FILE, {
                type: KeyType.LOW,
                encryptedKeyPair64: encryptedKeyPair64.substr(2)
            });
            this._router.goTo('import-from-file/decrypt-wallet');
        } else {
            // safe account (deprecated)
            this.actions.setData(RequestTypes.IMPORT_FROM_FILE, {
                type: KeyType.HIGH,
                encryptedKeyPair64
            });
            this._router.goTo('import-from-file/decrypt-safe');
        }
    }

    async _onDecrypt() {
        if (this.properties.keyType === KeyType.HIGH) {
            this.actions.decryptSafe();
        } else {
            this.actions.decryptWallet();
        }
    }

    _onSetLabel(label) {
        this.actions.setData(RequestTypes.IMPORT_FROM_FILE, { label });
        this.actions.importFromFileSafe();
    }
}
