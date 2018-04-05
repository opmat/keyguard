import XElement from '/libraries/x-element/x-element.js';
import XLoader from '/secure-elements/x-loader/x-loader.js';
import XCreateSafe from './requests/create-safe/x-create-safe.js';
import XCreateWallet from './requests/create-wallet/x-create-wallet.js';
import XImportWords from './requests/import-words/x-import-words.js';
import XImportFileWallet from './requests/import-file-wallet/x-import-file-wallet.js'
import XImportFileSafe from './requests/import-file-safe/x-import-file-safe.js';
import XSignSafe from './requests/sign-safe/x-sign-safe.js';
import XSignWallet from './requests/sign-wallet/x-sign-wallet.js';
import XBackupFile from './requests/backup-file/x-backup-file.js';
import XBackupWords from './requests/backup-words/x-backup-words.js';
import XRename from './requests/rename/x-rename.js';
import XClose from '/secure-elements/x-close/x-close.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';

export default class XKeyguard extends MixinRedux(XElement) {

    html() {
        return `
        <x-loader></x-loader>
        <div class="x-route-container">
            <x-create-safe x-route="create-safe"></x-create-safe>
            <x-create-wallet x-route="create-wallet"></x-create-wallet>
            <x-backup-words x-route="backup-words"></x-backup-words>
            <x-backup-file x-route="backup-file"></x-backup-file>
            <x-import-file-safe x-route="import-from-file"></x-import-file-safe>
            <x-import-file-wallet x-route="import-from-file"></x-import-file-wallet>
            <x-import-words x-route="import-from-words"></x-import-words>
            <div><x-sign-safe x-route="sign-safe-transaction"></x-sign-safe></div>
            <div><x-sign-wallet x-route="sign-wallet-transaction"></x-sign-wallet></div>
            <div><x-rename x-route="rename"></x-rename></div>
            <x-close x-route="close"></x-close>
            <div><x-close x-route="/"></x-close></div>
        </div>
        <a secondary x-href="close">
            <i class="material-icons">&#xE5C9;</i>
            Cancel
        </a>
        `;
    }

    children() {
        return [
            XLoader,
            XClose,
            XCreateSafe,
            XCreateWallet,
            XImportWords,
            XRename,
            XImportFileWallet,
            XImportFileSafe,
            XSignSafe,
            XSignWallet,
            XBackupWords,
            XBackupFile
        ];
    }

    static mapStateToProps(state) {
        return {
            executing: state.request.executing
        };
    }

    _onPropertiesChanged(changes) {
        if (changes.executing !== undefined) {
            this.$loader.loading = changes.executing;
        }
    }
}

// TODO what to do when the user reloads the page and the state is not initialized again?? > persist the state on unload
// that means we would have to put rpc requests in store and open new promises for unresponsed requests
