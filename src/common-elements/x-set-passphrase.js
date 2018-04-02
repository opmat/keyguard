import XElement from '/libraries/x-element/x-element.js';
import XRouter from '/secure-elements/x-router/x-router.js';
import XMyAccount from '/libraries/keyguard/src/common-elements/x-my-account.js';
import XPassphraseSetter from '/secure-elements/x-passphrase-setter/x-passphrase-setter.js';
import XPassphraseGetter from '/secure-elements/x-passphrase-getter/x-passphrase-getter.js';
import XPassphraseTipps from '/secure-elements/x-passphrase-tipps/x-passphrase-tipps.js';

export default class XSetPassphrase extends XElement {

    html() { return `
        <h1>Set a Passphrase</h1>
        <h2>Please enter a passphrase to secure your account.</h2>
        <p>The Passphrase is <strong>not</strong> an alternative for your 24 Recovery Words and it can not be changed or reset!</p>
        <x-my-account></x-my-account>
        <x-passphrase-setter x-route="" button-label="Confirm" show-indicator="true"></x-passphrase-setter>
        <section class="center" x-route="confirm">
            <h2>Please repeat your passphrase:</h2>
            <x-passphrase-getter button-label="Confirm"></x-passphrase-getter>
        </section>
        `;
    }

    children() {
        return [ XPassphraseTipps, XPassphraseSetter, XPassphraseGetter, XMyAccount ];
    }

    onAfterEntry() {
        this.$passphraseSetter.focus();
    }

    listeners() {
        return {
            'x-passphrase-setter-submitted': this._onSetterSubmit.bind(this),
            'x-passphrase-getter-submitted': this._onConfirmationSubmit.bind(this)
        }
    }

    async _onSetterSubmit(passphrase) {
        this._passphrase = passphrase;
        (await XRouter.instance).goTo(this, 'confirm');
        this.$passphraseGetter.focus();
    }

    _onConfirmationSubmit(passphrase2) {
        if (this._passphrase === passphrase2) {
            this.fire('x-set-passphrase', passphrase2);
        } else {
            this.$passphraseSetter.clear();
            this.$passphraseGetter.wrongPassphrase();
            setTimeout(async () => (await XRouter.instance).goTo(this, ''), 700);
        }
    }
}
