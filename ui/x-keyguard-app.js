import XElement from '/libraries/x-element/x-element.js';
// TODO what to do when the user reloads the page and the state is not initialized again?? > persist the state on unload
import XRouter from '/elements/x-router/x-router.js';
import XPersistAccount from './elements/x-persist-account.js';
import XImportWords from './elements/x-import-words.js';
import XImportFile from './elements/x-import-file.js';
import XSign from './elements/x-sign.js';

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
          <x-import-words x-route="import-from-words"> Import via mnemonic phrase </x-import-words>
          <x-import-file x-route="import-from-file"> Import via backup file </x-import-file>
          <x-sign x-route="sign"> Sign aka createTransaction </x-sign>
          <main x-route="export"> Export aka backup </main>
          <main x-route="rename"> Rename account </main>
          <main x-route="/">
            <x-loading-animation></x-loading-animation>
            <h2>Calling keyguard</h2>
            <a x-href="import-from-file">persist</a>
            <a x-href="persist">persist</a>
          </main>
        </x-router>
        `;
    }

    children() {
        return [ XRouter, XPersistAccount, XImportWords, XImportFile, XSign ];
    }
}

// TODO catch errors in a top level error panel catching all previously uncaught exceptions > XApp
