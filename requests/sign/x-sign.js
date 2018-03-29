import XElement from '/libraries/x-element/x-element.js';
import XMyAccount from '/libraries/keyguard/common-elements/x-my-account.js';
import XAccount from '/libraries/keyguard/common-elements/x-account.js';
import XAuthenticate from '/libraries/keyguard/common-elements/x-authenticate.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setData } from '/libraries/keyguard/requests/request-redux.js';
import { signTransaction } from './actions.js';

export default class XSign extends MixinRedux(XElement) {

    html() { return `
        <x-my-account></x-my-account>
        &#8675;
        <x-account></x-account>
        <h1>Transaction</h1>
        <h2><span class="value"></span> NIM</h2>
        <section>
            <p><span class="fee"></span> satoshis fee</p>
            <p>Valid from block #<span class="validity"></span></p>
        </section>
        <x-authenticate button-label="Confirm"></x-authenticate>
        `;
    }

    children() {
        return [ XAccount, XMyAccount, XAuthenticate ];
    }

    static mapStateToProps(state) {
        return {
            requestType: state.request.requestType,
            transaction: state.request.data.transaction
        };
    }

    static get actions() {
        return { signTransaction, setData };
    }

    onAfterEntry() {
        setTimeout(() => this.$authenticate.focus(), 100);
    }

    _onPropertiesChanged(changes) {
        const { requestType } = this.properties;

        if (requestType !== RequestTypes.SIGN_TRANSACTION) return;

        const { transaction } = changes;

        if (transaction) {
            const { recipient, value, fee, validityStartHeight } = transaction;

            this.$account.address = recipient;

            this.$('.value').textContent = (value/1e5).toString();
            this.$('.fee').textContent = fee;
            this.$('.validity').textContent = validityStartHeight;
        }
    }

    listeners() {
        return {
            'x-authenticate-submitted': passphrase => this.actions.signTransaction(passphrase)
        }
    }
}
