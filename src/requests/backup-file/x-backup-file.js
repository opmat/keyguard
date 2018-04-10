import XElement from '/libraries/x-element/x-element.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';
import XDownloadFile from '/libraries/keyguard/src/common-elements/x-download-file.js';
import XBackupEnterPin from './x-backup-enter-pin.js';
import { RequestTypes, setResult } from '../request-redux.js';
import { backupFile } from './actions.js';

export default class XBackupFile extends MixinRedux(XElement) {

    html() { return `
        <x-backup-enter-pin x-route=""></x-backup-enter-pin>
        <x-download-file x-route="download"></x-download-file>
        `;
    }

    children() {
        return [ XBackupEnterPin, XDownloadFile ];
    }

    static get actions() {
        return { backupFile, setResult };
    }

    listeners() {
        return {
            'x-authenticate-pin-submitted': this._onSubmit.bind(this),
            'x-file-download-complete': this._onFileDownload.bind(this)
        };
    }

    _onSubmit(pin) {
        this.actions.backupFile(pin);
    }

    _onFileDownload() {
        this.actions.setResult(RequestTypes.BACKUP_FILE, true);
    }
}