import XElement from '/libraries/x-element/x-element.js';
import XRouter from '/secure-elements/x-router/x-router.js';
import XSetLabel from '/libraries/keyguard/src/common-elements/x-set-label.js';
import XSetPassphrase from '/libraries/keyguard/src/common-elements/x-set-passphrase.js';
import XPrivacyAgent from '/secure-elements/x-privacy-agent/x-privacy-agent.js';
import XShowWords from '/libraries/keyguard/src/common-elements/x-show-words.js';
import XValidateWordsConnected from '../../common-elements/x-validate-words-connected.js';
import XIdenticons from '../../common-elements/x-identicons/x-identicons.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setData } from '../request-redux.js';
import { createPersistent } from './actions.js';

export default class XCreateSafe extends MixinRedux(XElement) {

    html() { return `
          <x-identicons x-route=""></x-identicons>
          <section x-route="warning">
            <h1>Backup your Account</h1>
            <x-grow></x-grow>
            <x-privacy-agent></x-privacy-agent>
          </section>
          <x-show-words x-route="words"></x-show-words>
          <x-validate-words-connected x-route="validate-words"></x-validate-words-connected>
          <x-set-passphrase x-route="set-passphrase"></x-set-passphrase>
          <x-set-label x-route="set-label"></x-set-label>
        `;
    }

    children() {
        return [
            XSetPassphrase,
            XSetLabel,
            XIdenticons,
            XPrivacyAgent,
            XShowWords,
            XValidateWordsConnected,
        ];
    }

    static mapStateToProps(state) {
        if (state.request.requestType !== RequestTypes.CREATE_SAFE) return;

        return {
            volatileKeys: state.keys.volatileKeys,
            volatileKey: state.request.data.volatileKey
        }
    }

    static get actions() {
        return { setData, createPersistent };
    }

    async onCreate() {
        super.onCreate();
        this._router = await XRouter.instance;
    }

    listeners() {
        return {
            'x-choose-identicon': this._onChooseIdenticon.bind(this),
            'x-surrounding-checked': this._onSurroundingChecked.bind(this),
            'x-show-words': this._onWordsSeen.bind(this),
            'x-validate-words-back': _ => this._router.goTo(this, 'words'),
            'x-validate-words': this._onWordsValidated.bind(this),
            'x-set-passphrase': this._onSetPassphrase.bind(this),
            'x-set-label': this._onSetLabel.bind(this)
        }
    }

    _onChooseIdenticon(address) {
        const volatileKey = this.properties.volatileKeys.get(address);
        this.actions.setData(RequestTypes.CREATE_SAFE, { address, volatileKey } );
        this._router.goTo(this, 'warning');
    }

    _onSurroundingChecked() {
        this.actions.setData(RequestTypes.CREATE_SAFE, {
            privateKey: this.properties.volatileKey.keyPair.privateKey.toHex()
        });
        this._router.goTo(this, 'words');
    }

    _onWordsSeen() {
        this._router.goTo(this, 'validate-words');
    }

    async _onWordsValidated() {
        this._router.goTo(this, 'set-passphrase');
    }

    _onSetPassphrase(passphrase) {
        this.actions.setData(RequestTypes.CREATE_SAFE, { passphrase });
        this._router.goTo(this, 'set-label');
    }

    _onSetLabel(label) {
        this.actions.setData(RequestTypes.CREATE_SAFE, { label });
        this.actions.createPersistent();
    }
}
