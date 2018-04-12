import XElement from '/libraries/x-element/x-element.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';
import XRouter from '/secure-elements/x-router/x-router.js';
import XUpgradeEnterPin from './x-upgrade-enter-pin.js';
import XUpgradeWelcome from './x-upgrade-welcome.js';
import XSetPassphrase from '/libraries/keyguard/src/common-elements/x-set-passphrase.js';
import XPrivacyAgent from '/secure-elements/x-privacy-agent/x-privacy-agent.js';
import XShowWords from '/libraries/keyguard/src/common-elements/x-show-words.js';
import XValidateWordsConnected from '/libraries/keyguard/src/common-elements/x-validate-words-connected.js';
import { RequestTypes, setData } from '../request-redux.js';
import { decrypt, encryptAndPersist } from './actions.js';

export default class XUpgrade extends MixinRedux(XElement) {

    html() { return `
        <x-upgrade-welcome x-route=""></x-upgrade-welcome>
        <x-upgrade-enter-pin x-route="enter-pin"></x-upgrade-enter-pin>
         <section x-route="warning">
            <h1>Upgrade your Account</h1>
            <x-grow></x-grow>
            <x-privacy-agent></x-privacy-agent>
        </section>
        <x-show-words x-route="words"></x-show-words>
        <x-validate-words-connected x-route="validate-words"></x-validate-words-connected>
        <x-set-passphrase x-route="set-passphrase"></x-set-passphrase>
        `;
    }

    children() {
        return [ XUpgradeWelcome, XUpgradeEnterPin, XPrivacyAgent, XShowWords, XValidateWordsConnected, XSetPassphrase ];
    }

    static get actions() {
        return { decrypt, encryptAndPersist, setData };
    }

    async onCreate() {
        this._router = (await XRouter.instance);
        super.onCreate();
    }

    listeners() {
        return {
            'x-upgrade-welcome-completed': this._onWelcomeCompleted.bind(this),
            'x-authenticate-pin-submitted': this._onSubmitPin.bind(this),
            'x-surrounding-checked': this._onSurroundingChecked.bind(this),
            'x-show-words': this._onWordsSeen.bind(this),
            'x-validate-words-back': _ => this._router.goTo(this, 'words'),
            'x-validate-words': this._onWordsValidated.bind(this),
            'x-set-passphrase': this._onSetPassphrase.bind(this)
        };
    }

    async _onWelcomeCompleted() {
        this._router.goTo(this, 'enter-pin');
    }

    _onSubmitPin(pin) {
        this.actions.decrypt(pin, () => this._router.goTo(this, 'warning'));
    }

    _onSurroundingChecked() {
        this._router.goTo(this, 'words');
    }

    _onWordsSeen() {
        this._router.goTo(this, 'validate-words');
    }

    async _onWordsValidated() {
        this._router.goTo(this, 'set-passphrase');
    }

    _onSetPassphrase(passphrase) {
        this.actions.setData(RequestTypes.UPGRADE, { passphrase });
        this.actions.encryptAndPersist();
    }
}