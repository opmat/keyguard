import XElement from '/libraries/x-element/x-element.js';
import XRouter from '/secure-elements/x-router/x-router.js';
import XViewTransaction from './x-view-transaction.js';
import XEnterPin from './x-enter-pin.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';
import { signWalletTransaction } from './actions.js';

export default class XSignWallet extends MixinRedux(XElement) {

    html() { return `
        <x-view-transaction x-route=""></x-view-transaction>
        <x-enter-pin x-route="enter-pin"></x-enter-pin>
        `;
    }

    children() {
        return [ XEnterPin, XViewTransaction ];
    }

    static get actions() {
        return { signWalletTransaction };
    }

    listeners() {
        return {
            'x-view-transaction-confirm': async () => (await XRouter.instance).goTo('sign-wallet-transaction/enter-pin'),
            'x-authenticate-pin-submitted': pin => this.actions.signWalletTransaction(pin)
        }
    }
}
