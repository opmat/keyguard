import XElement from '/libraries/x-element/x-element.js';
import XAuthenticate from '/libraries/keyguard/common-elements/x-authenticate.js';
import XMyAccount from '/libraries/keyguard/common-elements/x-my-account.js';
import XCreateFile from './x-create-file.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setResult } from '../request-redux.js';
import { exportFile } from './actions.js';

export default class XExportFile extends MixinRedux(XElement) {

    html() { return `
        <x-create-file x-route="export-file/download"></x-create-file>
        <section x-route="export-file">
            <h1>Backup your Account</h1>
            <x-my-account></x-my-account>
            <section>
                <p>Please enter your passphrase to backup your account.</p>
                <x-authenticate button-label="Backup"></x-authenticate>
            </section>
        </section>
        `;
    }

    children() {
        return [ XAuthenticate, XMyAccount, XCreateFile ];
    }

    static get actions() {
        return { exportFile, setResult };
    }

    listeners() {
        return {
            'x-authenticate-submitted': this._onSubmit.bind(this),
            'x-file-download-complete': this._onFileDownload.bind(this)
        };
    }

    _onSubmit(passphrase) {
        this.actions.exportFile(passphrase);
    }

    _onFileDownload() {
        this.actions.setResult(RequestTypes.EXPORT_FILE, true);
    }
}
