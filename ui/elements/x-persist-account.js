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
            <p>Your passphrase becomes stronger:</p>
            <ul>
                <li>
                    the longer it is
                </li>
                <li>
                    if you mix languages, use slang and misspellings
                </li>
                <li>
                    by adding special characters and numbers.
                </li>
            </ul>
        </section>
        <x-password-setter button-label="Confirm" show-indicator="true"></x-password-setter>
        `;
    }

    onCreate() {
        const { userFriendlyAddress } = this.attributes;
        if (!userFriendlyAddress) throw new Error('Data not available');
        this.$identicon.address = userFriendlyAddress;
        // TODO catch errors in a top level error panel catching all previously uncaught exceptions
        this.actions = bindActionCreators({setPassword}, store.dispatch);
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
