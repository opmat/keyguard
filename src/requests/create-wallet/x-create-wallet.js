import XElement from '/libraries/x-element/x-element.js';
import XRouter from '/secure-elements/x-router/x-router.js';
import XSetLabel from '/libraries/keyguard/src/common-elements/x-set-label.js';
import XSetPin from './x-set-pin.js';
import XIdenticons from './x-identicons/x-identicons.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setData } from '../request-redux.js';
import { createWalletPersistent } from './actions.js';

export default class XCreateWallet extends MixinRedux(XElement) {

    html() { return `
          <x-identicons x-route=""></x-identicons>
          <x-set-label x-route="set-label"></x-set-label>
          <x-set-pin x-route="set-pin"></x-set-pin>
          <section x-route="download">
            <x-download-file></x-download-file>
          </section>
        `;
    }

    children() {
        return [
            XSetPin,
            XSetLabel,
            XIdenticons,
        ];
    }

    static mapStateToProps(state) {
        if (state.request.requestType !== RequestTypes.CREATE_WALLET) return;

        const { address } = state.request.data;

        return {
            volatileKey: address && state.keys.volatileKeys.get(address)
        }
    }

    static get actions() {
        return { setData, createWalletPersistent };
    }

    async onCreate() {
        super.onCreate();
        this.router = await XRouter.instance;
    }

    listeners() {
        return {
            'x-choose-identicon': this._onChooseIdenticon.bind(this),
            'x-set-label': this._onSetLabel.bind(this),
            'x-set-pin': this._onSetPin.bind(this)
        }
    }

    _onChooseIdenticon(address) {
        this.actions.setData(RequestTypes.CREATE_WALLET, { address } );
        this.router.goTo(this, 'set-label');
    }

    _onSetLabel(label) {
        this.actions.setData(RequestTypes.CREATE_WALLET, { label });
        this.router.goTo(this, 'set-pin');
    }

    async _onSetPin(pin) {
        this.actions.setData(RequestTypes.CREATE_WALLET, { pin });
        this.actions.createWalletPersistent();
    }
}
