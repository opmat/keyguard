import XElement from '/libraries/x-element/x-element.js';
import XIdenticon from '/elements/x-identicon/x-identicon.js';
import reduxify from '/libraries/redux/src/redux-x-element.js';
import store from '/libraries/keyguard/store/store.js';
import { rename } from '/libraries/keyguard/store/request.js';

class XRenameAccount extends XElement {

    html() { return `
        <h1>Rename your Account</h1>
        <x-identicon></x-identicon>
        <section>
            <label>Name</label>
            <input type="text" placeholder="Account name">
        </section>
        <x-password-setter buttonLabel="Import" showIndicator="false"></x-password-setter>
        `;
    }

    onCreate() {
        this.$input = this.$('input');
    }

    _onPropertiesChanged(changes) {
        const { address, label } = this.properties;

        this.$identicon.setProperty('address', address);
        this.$input.value = label;
    }

    listeners() {
        return { // TODO [max] connect
            'x-password-setter-submitted': passphrase => this.actions.rename(passphrase, this.$input.value)
        }
    }

    children() {
        return [ XIdenticon ];
    }
}


/* connect the element to the redux store */
export default reduxify(
    store,
    state => ({
        address: state.request.data.address,
        label: state.request.data.label
    }),
    { rename }
)(XRenameAccount)
