import XElement from '/libraries/x-element/x-element.js';
import XRouter from '/secure-elements/x-router/x-router.js';
import XMyAccount from '/libraries/keyguard/src/common-elements/x-my-account.js';
import XPassphraseSetter from '/secure-elements/x-passphrase-setter/x-passphrase-setter.js';
import XPassphraseGetter from '/secure-elements/x-passphrase-getter/x-passphrase-getter.js';
import XPassphraseTipps from '/secure-elements/x-passphrase-tipps/x-passphrase-tipps.js';

export default class XSetPassphrase extends XElement {

    html() { return `
        <h1>Enter your Passphrase</h1>
        <h2>Please enter a passphrase to secure your account.</h2>
        <x-my-account></x-my-account>
        <x-passphrase-tipps></x-passphrase-tipps>
        <x-passphrase-setter x-route="" button-label="Confirm" show-indicator="true"></x-passphrase-setter>
        <x-passphrase-getter x-route="confirm"></x-passphrase-getter>
        `;
    }

    children() {
        return [ XPassphraseTipps, XPassphraseSetter, XPassphraseGetter, XMyAccount ];
    }

    listeners() {
        return {
            'x-passphrase-setter-submitted': async () => (await XRouter.instance).goTo(this, 'confirm'),
            'x-passphrase-getter-submitted': (passphrase) => this.fire('x-set-passphrase', passphrase),
        }
    }

    onAfterEntry() {
        this.$passphraseSetter.focus();
    }
}
