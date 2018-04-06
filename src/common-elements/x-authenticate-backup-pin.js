import XElement from '/libraries/x-element/x-element.js';
import XAuthenticatePin from '/libraries/keyguard/src/common-elements/x-authenticate-pin.js';
import XMyAccount from '/libraries/keyguard/src/common-elements/x-my-account.js';

export default class XAuthenticateBackupPin extends XElement {

    html() { return `
        <h1>Backup your Account</h1>
        <h2>Please enter your pin to backup your account.</h2>
        <x-grow x-grow="0.5"></x-grow>
        <x-my-account></x-my-account>
        <x-authenticate-pin button-label="Backup"></x-authenticate-pin>
        `;
    }

    children() {
        return [ XAuthenticatePin, XMyAccount ];
    }

    onAfterEntry() {
        this.$authenticate.focus();
    }
}
