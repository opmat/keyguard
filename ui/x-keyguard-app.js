import XElement from '/libraries/x-element/x-element.js';
import XPersistAccount from './elements/x-persist-account.js';
import XRouter from '/elements/x-router/x-router.js';

export default class XKeyguardApp extends XElement {

    static launch() { window.addEventListener('load', () => new this()); }

    get __tagName() { return 'body' }

    onCreate() {
    }

    html() {
        return `
        <x-router>
          <x-persist-account x-route="persist">
          </x-persist-account>
          <main x-route="/">
            <a x-href="persist">persist</a>
          </main>
        </x-router>
        `;
    }

    children() {
        return [ XRouter, XPersistAccount ];
    }
}
