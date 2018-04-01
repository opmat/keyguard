import XElement from '/libraries/x-element/x-element.js';
import XPinpad from '/secure-elements/x-pinpad/x-pinpad.js';
import XToast from '/secure-elements/x-toast/x-toast.js';

export default class XSetPin extends XElement {

    html() { return `
        <h1>Choose your pin</h1>
        <h2>Please enter a pin to protect your account</h2>
        <x-pinpad></x-pinpad>
        `;
    }

    children() { return [ XPinpad ]; }

    listeners() {
        return {
            'x-pin': this._onEnterPin.bind(this)
        }
    }

    onEntry() {
        this._pin = null;
        this.$pinpad.show();
    }

    onExit() {
        this.$pinpad.hide();
    }

    async _onEnterPin(pin) {
        if (!this._pin) {
            this._pin = pin;
            this.$pinpad.reset();
            XToast.show('Please repeat PIN to confirm');
        } else if (this._pin !== pin) {
            this.$pinpad.onPinIncorrect();
            this._pin = null;
            XToast.show('PIN not matching. Please choose a new one.', 'error');
        } else {
            this.fire('x-set-pin', pin);
        }
    }
}