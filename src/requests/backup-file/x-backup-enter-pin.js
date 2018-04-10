import XElement from '/libraries/x-element/x-element.js';
import XAuthenticatePin from '/libraries/keyguard/src/common-elements/x-authenticate-pin.js';
import XMyAccount from '/libraries/keyguard/src/common-elements/x-my-account.js';

export default class XBackupEnterPin extends XElement {

    html() { return `
        <section>
        <h1>Backup your Account</h1>
        <h2>Please enter your PIN to backup your account.</h2>
        <x-grow x-grow="0.5"></x-grow>
        <x-my-account></x-my-account>
        <x-grow></x-grow>
        <x-authenticate-pin button-label="Backup"></x-authenticate-pin>
        </section>
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
}
