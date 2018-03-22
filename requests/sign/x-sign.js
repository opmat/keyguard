import XElement from '/libraries/x-element/x-element.js';
import XIdenticon from '/elements/x-identicon/x-identicon.js';
import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setData } from '/libraries/keyguard/requests/request-redux.js';
import { signTransaction } from './actions.js';

export default class XSign extends MixinRedux(XElement) {

    html() { return `
        <x-identicon></x-identicon>
        &#8675;
        <x-identicon></x-identicon>
        <h1>Transaction</h1>
        <h2><span class="value"></span> NIM</h2>
        <section>
            <p><span class="fee"></span> satoshis fee</p>
            <p>Valid from block #<span class="validity"></span></p>
        </section>
        <x-password-setter buttonLabel="Confirm" showIndicator="false"></x-password-setter>
        `;
    }

    children() {
        return [ XIdenticon, XPasswordSetter ];
    }

    static mapStateToProps(state) {
        return {
            requestType: state.request.requestType,
            transaction: state.request.data.transaction,
            isWrongPassphrase: state.request.data.isWrongPassphrase
        };
    }

    static get actions() {
        return { signTransaction, setData };
    }

    _onPropertiesChanged(changes) {
        const { requestType } = this.properties;

        if (requestType !== RequestTypes.SIGN_TRANSACTION) return;

        const { transaction, isWrongPassphrase } = changes;

        if (transaction) {
            const { sender, recipient, value, fee, validityStartHeight } = transaction;

            this.$identicon[0].address = sender;
            this.$identicon[1].address = recipient;

            this.$('.value').textContent = (value/1e5).toString();
            this.$('.fee').textContent = fee;
            this.$('.validity').textContent = validityStartHeight;
        }

        if (isWrongPassphrase) {
            this.$passwordSetter.wrongPassphrase();
            this.actions.setData(RequestTypes.SIGN_TRANSACTION, { isWrongPassphrase: false });
        }
    }

    listeners() {
        return {
            'x-password-setter-submitted': passphrase => this.actions.signTransaction(passphrase)
        }
    }
}
