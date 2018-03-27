import XElement from '/libraries/x-element/x-element.js';
import XAuthenticate from '/libraries/keyguard/common-elements/x-authenticate.js';
import XMyAccount from '/libraries/keyguard/common-elements/x-my-account.js';
import XDownloadFile from '/libraries/keyguard/common-elements/x-download-file.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setResult } from '../request-redux.js';
import { backupFile } from './actions.js';

export default class XBackupFile extends MixinRedux(XElement) {

    html() { return `
        <section x-route="backup-file/download">
            <h1>Save your Access File</h1>
            <x-download-file></x-download-file>
        </section>
        <section x-route="backup-file">
            <h1>Backup your Account</h1>
            <h2>Please enter your passphrase to backup your account.</h2>
            <x-grow x-grow="0.5"></x-grow>
            <x-my-account></x-my-account>
            <x-authenticate button-label="Backup"></x-authenticate>
        </section>
        `;
    }

    children() {
        return [ XAuthenticate, XMyAccount, XDownloadFile ];
    }

    static get actions() {
        return { backupFile, setResult };
    }

    listeners() {
        return {
            'x-authenticate-submitted': this._onSubmit.bind(this),
            'x-file-download-complete': this._onFileDownload.bind(this)
        };
    }

    _onSubmit(passphrase) {
        this.actions.backupFile(passphrase);
    }

    _onFileDownload() {
        this.actions.setResult(RequestTypes.BACKUP_FILE, true);
    }
}
