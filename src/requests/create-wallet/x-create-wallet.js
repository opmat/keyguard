import XElement from '/libraries/x-element/x-element.js';
import XRouter from '/secure-elements/x-router/x-router.js';
import XSetLabel from '/libraries/keyguard/src/common-elements/x-set-label.js';
import XSetPassphrase from '/libraries/keyguard/src/common-elements/x-set-passphrase.js';
import XIdenticons from './x-identicons/x-identicons.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setData } from '../request-redux.js';
import { createPersistent } from './actions.js';

export default class XCreateWallet extends MixinRedux(XElement) {

    html() { return `
          <x-identicons x-route=""></x-identicons>
          <x-set-label x-route="set-label"></x-set-label>
          <x-set-passphrase x-route="set-passphrase"></x-set-passphrase>
          <section x-route="download">
            <x-download-file></x-download-file>
          </section>
        `;
    }

    children() {
        return [
            XSetPassphrase,
            XSetLabel,
            XIdenticons,
        ];
    }

    static mapStateToProps(state) {
        if (state.request.requestType !== RequestTypes.CREATE_WALLET) return;

        const { address } = state.request.data;

        return {
            volatileKey: address && state.keys.volatileKeys.get(address),
            passphrase: state.request.data.passphrase
        }
    }

    static get actions() {
        return { setData, createPersistent };
    }

    async onCreate() {
        super.onCreate();
        this.router = await XRouter.instance;
    }

    listeners() {
        return {
            'x-choose-identicon': this._onChooseIdenticon.bind(this),
            'x-set-label': this._onSetLabel.bind(this),
            'x-set-passphrase': this._onSetPassphrase.bind(this)
        }
    }

    _onChooseIdenticon(address) {
        this.actions.setData(RequestTypes.CREATE_WALLET, { address } );
        this.router.goTo(this, 'set-label');
    }

    _onSetLabel(label) {
        this.actions.setData(RequestTypes.CREATE_WALLET, { label });
        this.router.goTo(this, 'set-passphrase');
    }

    async _onSetPassphrase(passphrase) {
        this.actions.setData(RequestTypes.CREATE_WALLET, { passphrase });
        this.actions.createPersistent();
        const encryptedKeyPair = await volatileKey.exportEncrypted(passphrase);

        this.actions.setResult(RequestTypes.CREATE_WALLET, {
            encryptedKeyPair
        });
    }
}
