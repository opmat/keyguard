import XElement from '/libraries/x-element/x-element.js';
import XRouter from '/elements/x-router/x-router.js';
import XLoader from '/elements/x-loader/x-loader.js';
import XSetLabel from './elements/x-set-label.js';
import XPersistAccount from './requests/create/x-persist-account.js';
import XIdenticons from './requests/create/x-identicons/x-identicons.js';
import XImportWords from './requests/import-words/x-import-words.js';
import XSaveRecovered from './requests/import-words/x-save-recovered.js';
import XImportFile from './requests/import-file/x-import-file.js';
import XSign from './requests/sign/x-sign.js';
import XExport from './requests/export-file/x-export.js';
import XRenameAccount from './requests/rename/x-rename-account.js';
import XClose from '/elements/x-close/x-close.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';

export default class XKeyguard extends MixinRedux(XElement) {

    html() {
        return `
        <x-loader></x-loader>
        <x-router>
          <x-identicons x-route="create"></x-identicons>
          <x-persist-account x-route="persist"></x-persist-account>
          <x-set-label x-route="set-label"></x-set-label>
          <x-save-recovered x-route="save-recovered"></x-save-recovered>
          <x-import-words x-route="import-from-words"></x-import-words>
          <x-import-file x-route="import-from-file"></x-import-file>
          <x-sign x-route="sign"></x-sign>
          <x-export></x-export>
          <x-rename-account x-route="rename"></x-rename-account>
          <x-close x-route="/"></x-close>
        </x-router>
        `;
    }

    children() {
        return [ XLoader, XRouter, XClose, XIdenticons, XPersistAccount, XSetLabel, XImportWords, XSaveRecovered,  XImportFile, XSign, XExport, XRenameAccount ];
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

        if (changes.isWrongPassphrase) {
            const activePasswordSetter = XElement.elementMap(this.$('.in x-password-setter'));
            if (activePasswordSetter) {
                activePasswordSetter.wrongPassphrase();
            }
        }
    }
}

// TODO what to do when the user reloads the page and the state is not initialized again?? > persist the state on unload
// that means we would have to put rpc requests in store and open new promises for unresponsed requests
