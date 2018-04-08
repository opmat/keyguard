import XElement from '/libraries/x-element/x-element.js';
import XAuthenticatePin from '/libraries/keyguard/src/common-elements/x-authenticate-pin.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';

export default class XEnterPin extends MixinRedux(XElement) {

    html() { return `
        <h1>Enter your PIN</h1>
        <h2>Please enter your PIN to authorize the transaction</h2>
        <x-grow></x-grow>
        <x-authenticate-pin x-route=""></x-authenticate-pin>
        `;
    }

    children() {
        return [ XAuthenticatePin ];
    }

    onEntry() {
        this.$authenticatePin.$pinpad.open();
    }

    onExit() {
        this.$authenticatePin.$pinpad.close();
    }
}
