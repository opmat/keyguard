import XElement from '/libraries/x-element/x-element.js';
import XIdenticon from '/elements/x-identicon/x-identicon.js';
import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import XPassphraseTipps from '/elements/x-passphrase-tipps/x-passphrase-tipps.js';

export default class XSetLabel extends XElement {

    html() { return `
        <x-identicon></x-identicon>
        <h1>Name your Account</h1>
        <section>
            <label>Name</label>
            <input type="text" placeholder="Account name">
        </section>
        <button>Confirm</button>
        `;
    }

    children() {
        return [ XIdenticon ];
    }

    onCreate() {
        this.$input = this.$('input');
    }

    _onPropertiesChanged(changes) {
        const { address } = changes;

        this.$identicon.setProperty('address', address);
    }

    listeners() {
        return {
            'click button': e => console.log(`XSetLabel: label=${ this.$input.value }`)
        }
    }
}
