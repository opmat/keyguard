import XElement from '/libraries/x-element/x-element.js';
import XAuthenticatePin from '/libraries/keyguard/src/common-elements/x-authenticate-pin.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setData } from '../request-redux.js';

export default class XDecryptWallet extends MixinRedux(XElement) {

    html() { return `
        <h1>Enter your PIN</h1>
        <h2>Please enter your PIN to unlock your Account Access File.</h2>
        <x-grow></x-grow>
        <x-authenticate-pin button-label="Import"></x-authenticate-pin>
        <x-grow></x-grow>
        `;
    }

    children() {
        return [ XAuthenticatePin ];
    }

    listeners() {
        return {
            'x-authenticate-pin-submitted': this._onSubmit.bind(this)
        };
    }

    onEntry() {
        console.log("onentry");
        this.$authenticatePin.$pinpad.open();
    }

    onExit() {
        console.log("onexit");
        this.$authenticatePin.$pinpad.close();
    }

    static get actions() {
        return { setData };
    }

    _onSubmit(pin) {
        this.actions.setData(RequestTypes.IMPORT_FROM_FILE_WALLET, { pin });
        this.fire('x-decrypt');
    }
}
