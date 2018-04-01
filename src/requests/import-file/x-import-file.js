import XElement from '/libraries/x-element/x-element.js';
import XRouter from '/secure-elements/x-router/x-router.js';
// import XAccountBackupImport from '/secure-elements/x-account-backup-import/x-account-backup-import.js';
import XSetLabel from '/libraries/keyguard/src/common-elements/x-set-label.js';
import XDecrypt from './x-decrypt.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setData } from '/libraries/keyguard/src/requests/request-redux.js';
import { importFromFile, decrypt } from './actions.js';

export default class XImportFile extends MixinRedux(XElement) {

    html() {
        return `
            <section x-route="">
                <h1>Import Access File</h1>
                <x-grow></x-grow>
                <x-account-backup-import></x-account-backup-import>
                <x-grow></x-grow>
            </section>
            <x-decrypt x-route="decrypt"></x-decrypt>
            <x-set-label x-route="set-label"></x-set-label>
        `
    }

    children() {
        return [ /* XAccountBackupImport */, XSetLabel, XDecrypt ];
    }

    async onCreate() {
        super.onCreate();
        this.router = await XRouter.instance;
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
        this.router.goTo('import-from-file/decrypt');
    }

    _onDecrypt() {
        this.actions.decrypt();
    }

    _onSetLabel(label) {
        this.actions.setData(RequestTypes.IMPORT_FROM_FILE, { label });
        this.actions.importFromFile();
    }
}
