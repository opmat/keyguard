import XElement from '/libraries/x-element/x-element.js';
import XPersistAccount from './elements/x-persist-account.js';
import XIdenticon from '/elements/x-identicon/x-identicon.js';
import XPasswordInput from '/elements/x-password-input/x-password-input.js';
import XRouter from '/elements/x-router/x-router.js';

export default class XKeyguardApp extends XElement {

    static launch() { window.addEventListener('load', () => new this()); }

    get __tagName() { return 'body' }

    html() {
        return `
        <x-router>
          <x-persist-account x-route="persist">
            <x-identicon></x-identicon>
            <x-password-input></x-password-input>
            <button>Confirm</button>
          </x-persist-account>
          <main x-route="/">
            <a x-href="persist">persist</a>
          </main>
        </x-router>
        `;
    }

    children() {
        return [ XRouter, XPersistAccount, XIdenticon, XPasswordInput ];
    }

    onCreate() {
        this.$identicon.address = 'monkey pie';
    }
}