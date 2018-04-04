import XElement from '/libraries/x-element/x-element.js';
import XMyAccount from '/libraries/keyguard/src/common-elements/x-my-account.js';
import BrowserDetection from '/libraries/secure-utils/browser-detection/browser-detection.js';

export default class XSetLabel extends XElement {

    html() { return `
        <h1>Label your Account</h1>
        <h2>This label is only visible to you</h2>
        <x-grow></x-grow>
        <x-my-account></x-my-account>
        <x-grow></x-grow>
        <input type="text" placeholder="Account label" maxlength="24">
        <x-grow x-grow="2"></x-grow>
        <button>Confirm</button>
        `;
    }

    children() {
        return [ XMyAccount ];
    }

    onCreate() {
        this.$input = this.$('input');
        this._oldInput = '';
    }

    onAfterEntry() {
        this.$input.focus();
    }

    listeners() {
        return {
            'keydown input': this._submitIfReturn.bind(this),
            'input input': this._cleanInput.bind(this),
            'click button': this._returnValue.bind(this)
        }
    }

    _submitIfReturn(d, e) {
        if (e.keyCode == 13) {
            this._returnValue();
        }
    }

    _cleanInput() {
        if (!BrowserDetection.isSafari() && !BrowserDetection.isIOS()) return;

        const currentValue = this.$input.value;
        const encoded = encodeURIComponent(currentValue);

        if (encoded.length > 24) {
            this.$input.value = this._oldInput;
        } else {
            this._oldInput = currentValue;
        }
    }

    _returnValue() {
        this.fire('x-set-label', this.$input.value);
    }
}

