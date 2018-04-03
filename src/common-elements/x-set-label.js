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
    }

    onEntry() {
        this.$input.focus();
    }

    listeners() {
        return {
            'keydown input': this._submitIfReturn.bind(this),
            'keyup input': this._cleanInput.bind(this),
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

        this.$input.value = this.$input.value.replace(/[^\x00-\x7F]/g, '');
    }

    _returnValue() {
        this.fire('x-set-label', this.$input.value);
    }
}

