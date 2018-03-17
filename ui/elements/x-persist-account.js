import XElement from '/libraries/x-element/x-element.js';
import XIdenticon from '/elements/x-identicon/x-identicon.js';
import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import store from '../../store/store.js';
import { confirmPersist } from '../../store/user-inputs.js';
import reduxify from '/libraries/redux/src/redux-x-element.js';

class XPersistAccount extends XElement {

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

    _onPropertiesChanged() {
        const { userFriendlyAddress } = this.properties;

        if (userFriendlyAddress) {
            this.$identicon.address = userFriendlyAddress;
        }
    }

    listeners() {
        return {
            'x-password-setter-submitted': password => this.actions.confirmPersist(password)
        }
    }

    children() {
        return [ XIdenticon, XPasswordSetter ];
    }
}


/* connect the element to the redux store */
export default reduxify(
    store,
    state => ({
        userFriendlyAddress: state.keys.toBePersisted
    }),
    { confirmPersist }
)(XPersistAccount)
