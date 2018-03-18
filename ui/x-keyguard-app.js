import XElement from '/libraries/x-element/x-element.js';
import XRouter from '/elements/x-router/x-router.js';
import XPersistAccount from './elements/x-persist-account.js';
import XIdenticons from './elements/x-identicons/x-identicons.js';
import XImportWords from './elements/x-import-words.js';
import XImportFile from './elements/x-import-file.js';
import XSign from './elements/x-sign.js';
import XExport from './elements/x-export.js';
import XRenameAccount from './elements/x-rename-account.js';

export default class XKeyguardApp extends XElement {

    // TODO [sven] move to new XApp class
    static launch() {
        if (document.readyState === 'complete') return new this();
        else window.addEventListener('load', () => new this());
    }

    get __tagName() { return 'body' }

    html() {
        return `
        <x-router>
          <x-persist-account x-route="persist"></x-persist-account>
          <x-identicons x-route="create"></x-identicons>
          <x-import-words x-route="import-from-words"> Import via mnemonic phrase </x-import-words>
          <x-import-file x-route="import-from-file"> Import via backup file </x-import-file>
          <x-sign x-route="sign"> Sign aka createTransaction </x-sign>
          <x-export> Export aka backup </x-export>
          <x-rename-account x-route="rename"> Rename account </x-rename-account>
          <main x-route="/">
            <x-loading-animation></x-loading-animation>
            <h2>Calling keyguard</h2>
            <a x-href="persist">persist volatile account</a>
            <a x-href="create">create account</a>
            <a x-href="import-from-words">import account with words</a>
            <a x-href="import-from-file">import account from file</a>
            <a x-href="sign">sign transaction</a>
            <a x-href="export">export account</a>
            <a x-href="rename">rename account</a>
          </main>
        </x-router>
        `;
    }

    children() {
        return [ XRouter, XPersistAccount, XIdenticons, XImportWords, XImportFile, XSign, XExport, XRenameAccount ];
    }
}

// TODO catch errors in a top level error panel catching all previously uncaught exceptions > XApp
// TODO what to do when the user reloads the page and the state is not initialized again?? > persist the state on unload
// that means we would have to put rpc requests in store and open new promises for unresponsed requests
