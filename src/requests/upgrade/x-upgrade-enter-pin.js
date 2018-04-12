import XElement from '/libraries/x-element/x-element.js';
import XAuthenticatePin from '/libraries/keyguard/src/common-elements/x-authenticate-pin.js';
import XMyAccount from '/libraries/keyguard/src/common-elements/x-my-account.js';

export default class XUpgradeEnterPin extends XElement {

    html() { return `
        <h1>Upgrade your Account</h1>
        <h2>Please enter your PIN to upgrade your account.</h2>
        <x-grow x-grow="0.5"></x-grow>
        <x-my-account></x-my-account>
        <x-grow x-grow="0.5"></x-grow>
        <x-authenticate-pin button-label="Continue"></x-authenticate-pin>
        <x-grow></x-grow>
        `;
    }

    children() {
        return [ XAuthenticatePin, XMyAccount ];
    }

    onEntry() {
        this.$authenticatePin.$pinpad.open();
    }

    onExit() {
        this.$authenticatePin.$pinpad.close();
    }

    onBeforeExit() {
        this.$authenticatePin.$pinpad.close();
    }
}
