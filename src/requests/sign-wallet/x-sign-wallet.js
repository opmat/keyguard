import XElement from '/libraries/x-element/x-element.js';
import XMyAccount from '/libraries/keyguard/src/common-elements/x-my-account.js';
import XAccount from '/libraries/keyguard/src/common-elements/x-account.js';
import XAuthenticatePin from '/libraries/keyguard/src/common-elements/x-authenticate-pin.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setData } from '/libraries/keyguard/src/requests/request-redux.js';
import { signWalletTransaction } from './actions.js';

export default class XSignWallet extends MixinRedux(XElement) {

    html() { return `
        <h1>Authorize Transaction</h1>
        <h2>Enter your pin below to authorize this transaction:</h2>
        <x-my-account></x-my-account>
        <i class="material-icons">arrow_downward</i>
        <x-account></x-account>
        <div class="x-value"><span class="value"></span> NIM</div>
        <div class="x-fee"><span class="fee"></span> Fee</div>
        <x-authenticate-pin></x-authenticate-pin>
        `;
    }

    children() {
        return [ XAccount, XMyAccount, XAuthenticatePin ];
    }

    onEntry() {
        this.$authenticatePin.$pinpad.open();
    }

    onExit() {
        this.$authenticatePin.$pinpad.close();
    }

    static mapStateToProps(state) {
        return {
            requestType: state.request.requestType,
            transaction: state.request.data.transaction
        };
    }

    static get actions() {
        return { signWalletTransaction, setData };
    }

    _onPropertiesChanged(changes) {
        const { requestType } = this.properties;

        if (requestType !== RequestTypes.SIGN_WALLET_TRANSACTION) return;

        const { transaction } = changes;

        if (transaction) {
            const { recipient, value, fee, validityStartHeight } = transaction;

            this.$account.address = recipient;

            this.$('.value').textContent = (value/1e5).toString();

            if (fee === 0) {
                this.$el.removeChild(this.$('.x-fee'));
            } else {
                this.$('.fee').textContent = (fee/1e5).toString();
            }
        }
    }

    listeners() {
        return {
            'x-authenticate-pin-submitted': pin => this.actions.signWalletTransaction(pin)
        }
    }
}
