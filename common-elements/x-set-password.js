import XElement from '/libraries/x-element/x-element.js';
import XIdenticon from '/elements/x-identicon/x-identicon.js';
import XAddress from '/elements/x-address/x-address.js';
import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import XPassphraseTipps from '/elements/x-passphrase-tipps/x-passphrase-tipps.js';

export default class XSetPassword extends XElement {

    html() { return `
        <x-identicon></x-identicon>
        <x-address></x-address>
        <h1>Enter your Passphrase</h1>
        <x-passphrase-tipps></x-passphrase-tipps>
        <x-password-setter button-label="Confirm" show-indicator="true"></x-password-setter>
        `;
    }

    children() {
        return [ XIdenticon, XAddress, XPassphraseTipps, XPasswordSetter ];
    }

    _onPropertiesChanged(changes) {
        const { address } = changes;

        this.$identicon.setProperty('address', address);
    }

    listeners() {
        return {
            'x-password-setter-submitted': passphrase => this.actions.onSubmit(passphrase)
        }
    }
}
