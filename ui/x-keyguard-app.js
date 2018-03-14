import XElement from '/libraries/x-element/x-element.js';
import XRouter from '/elements/x-router/x-router.js';
import XPersistAccount from './elements/x-persist-account.js';
import XImportFile from './elements/x-import-file.js';

export default class XKeyguardApp extends XElement {

    // TODO [sven] move to new XApp class
    static launch() {
        if (document.readyState === "complete") new XKeyguardApp();
        else window.addEventListener('load', () => new this());
    }

    get __tagName() { return 'body' }

    onCreate() { }

    html() {
        return `
        <x-router>
          <x-persist-account x-route="persist"></x-persist-account>
          <main x-route="import-from-words"> Import via mnemonic phrase </main>
          <x-import-file x-route="import-from-file"> Import via backup file </x-import-file>
          <main x-route="sign"> Sign aka createTransaction </main>
          <main x-route="export"> Export aka backup </main>
          <main x-route="rename"> Rename account </main>
          <main x-route="/">
            <h1>Test Page</h1>
            <a x-href="import-from-file">persist</a>
            <a x-href="persist">persist</a>
          </main>
        </x-router>
        `;
    }

    children() {
        return [ XRouter, XPersistAccount, XImportFile ];
    }
}
