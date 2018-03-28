import XElement from '/libraries/x-element/x-element.js';
import XMyAccount from '/libraries/keyguard/common-elements/x-my-account.js';
import XAddress from '/elements/x-address/x-address.js';
import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import XPassphraseTipps from '/elements/x-passphrase-tipps/x-passphrase-tipps.js';

export default class XSetPassphrase extends XElement {

    html() { return `
        <h1>Enter your Passphrase</h1>
        <h2>Please enter a password to secure your account.</h2>
        <x-my-account></x-my-account>
        <x-passphrase-tipps></x-passphrase-tipps>
        <x-password-setter button-label="Confirm" show-indicator="true"></x-password-setter>
        `;
    }

    children() {
        return [ XAddress, XPassphraseTipps, XPasswordSetter, XMyAccount ];
    }

    listeners() {
        return {
            'x-password-setter-submitted': (passphrase) => this.fire('x-set-passphrase', passphrase)
        }
    }

    onEntry() {
        this.$passwordSetter.focus();
    }
}
