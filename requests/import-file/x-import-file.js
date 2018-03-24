import XElement from '/libraries/x-element/x-element.js';
import XRouter from '/elements/x-router/x-router.js';
import XWalletBackupImport from '/elements/x-wallet-backup-import/x-wallet-backup-import.js';
import XSetLabel from '/libraries/keyguard/common-elements/x-set-label.js';
import XDecrypt from './x-decrypt.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setData } from '/libraries/keyguard/requests/request-redux.js';
import { importFromFile, decrypt } from './actions.js';

export default class XImportFile extends MixinRedux(XElement) {

    html() {
        return `
            <x-set-label x-route="import-from-file/set-label"></x-set-label>
            <x-decrypt x-route="import-from-file/decrypt"></x-decrypt>
            <x-wallet-backup-import x-route="import-from-file"></x-wallet-backup-import>
        `
    }

    children() {
        return [ XWalletBackupImport, XSetLabel, XDecrypt ];
    }

    static get actions() {
        return { setData, importFromFile, decrypt };
    }

    listeners() {
        return {
            'x-read-file': this._onReadFile.bind(this),
            'x-decrypt': this._onDecrypt.bind(this),
            'x-set-label': this._onSetLabel.bind(this)
        }
    }

    _onReadFile(encryptedKeyPair64) {
        this.actions.setData(RequestTypes.IMPORT_FROM_FILE, { encryptedKeyPair64 });
        XRouter.root.goTo('import-from-file/decrypt');
    }

    _onDecrypt() {
        this.actions.decrypt();
    }

    _onSetLabel(label) {
        this.actions.setData(RequestTypes.IMPORT_FROM_FILE, { label });
        this.actions.importFromFile();
    }
}