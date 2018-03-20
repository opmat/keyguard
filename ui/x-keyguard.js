import XElement from '/libraries/x-element/x-element.js';
import XRouter from '/elements/x-router/x-router.js';
import XPersistAccount from './elements/x-persist-account.js';
import XIdenticons from './elements/x-identicons/x-identicons.js';
import XImportWords from './elements/x-import-words.js';
import XImportFile from './elements/x-import-file.js';
import XSign from './elements/x-sign.js';
import XExport from './elements/x-export.js';
import XRenameAccount from './elements/x-rename-account.js';
import XClose from '/elements/x-close/x-close.js';

export default class XKeyguard extends XElement {

    html() {
        return `
        <x-router>
          <x-persist-account x-route="persist"></x-persist-account>
          <x-identicons x-route="create"></x-identicons>
          <x-import-words x-route="import-from-words"> Import via mnemonic phrase </x-import-words>
          <x-import-file x-route="import-from-file"> Import via backup file </x-import-file>
          <x-sign x-route="sign"></x-sign>
          <x-export></x-export>
          <x-rename-account x-route="rename"> Rename account </x-rename-account>
          <x-close x-route="/"></x-close>
        </x-router>
        `;
    }

    children() {
        return [ XRouter, XClose, XPersistAccount, XIdenticons, XImportWords, XImportFile, XSign, XExport, XRenameAccount ];
    }
}

// TODO what to do when the user reloads the page and the state is not initialized again?? > persist the state on unload
// that means we would have to put rpc requests in store and open new promises for unresponsed requests

// todo avoid that going back to loading/home screen is possible