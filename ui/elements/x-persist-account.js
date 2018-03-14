import XElement from '/libraries/x-element/x-element.js';
import XIdenticon from '/elements/x-identicon/x-identicon.js';
import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import store from '../../store/store.js';
import { setPassword } from '../../store/user-inputs.js';
import connect from '/libraries/redux/src/redux-x-element.js';

class XPersistAccount extends XElement {

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
        <x-password-setter button-label="Confirm" show-indicator="true"></x-password-setter>
        `;
    }

    _onPropertiesChanged() {
        const { userFriendlyAddress } = this.properties;

        if (userFriendlyAddress) {
            this.$identicon.address = value;
        }
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

/* connect the element to the redux store */
export default connect(
    store,
    state => {
        userFriendlyAddress: state.accounts.toBePersisted
    },
    { setPassword }
)(XPersistAccount)
