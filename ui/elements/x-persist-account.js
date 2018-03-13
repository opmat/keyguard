import XElement from '/libraries/x-element/x-element.js';
import XIdenticon from '/elements/x-identicon/x-identicon.js';
import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import store from '../../store/store.js';
import { bindActionCreators } from '/libraries/redux/src/index.js';
import { setPassword } from '../../store/user-inputs.js';

export default class XPersistAccount extends XElement {

    html() { return `
        <x-identicon></x-identicon>
        <h1>Enter your Passphrase</h1>
        <section>
            <p>Please enter a passphrase to secure your account.</p>
            <p>Your pass phrase will become stronger if you&hellip;</p>
            <ul>
                <li>
                    make it longer!
                </li>
                <li>
                    mix languages together, use slang, or even misspellings
                </li>
                <li>
                    add special characters and numbers.
                </li>
            </ul>
        </section>
        <x-password-setter buttonLabel="Confirm" showIndicator="true"></x-password-setter>
        `;
    }

    onCreate() {
        this.actions = bindActionCreators({setPassword}, store.dispatch);
        store.subscribe(() => {
            const state = store.getState();
            if (state.accounts.toBePersisted) this.$identicon.address = state.accounts.toBePersisted
        });

    }

    listeners() {
        return {
            'x-password-setter-valid': password => this.actions.setPassword(password)
        }
    }

    children() {
        return [ XIdenticon, XPasswordSetter ];
    }

}
