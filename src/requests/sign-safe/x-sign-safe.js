import XElement from '/libraries/x-element/x-element.js';
import XAuthenticate from '/libraries/keyguard/src/common-elements/x-authenticate.js';
import XIdenticon from '/secure-elements/x-identicon/x-identicon.js';
import XAddressNoCopy from '/secure-elements/x-address-no-copy/x-address-no-copy.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setData } from '/libraries/keyguard/src/requests/request-redux.js';
import { signSafeTransaction } from './actions.js';

export default class XSignSafe extends MixinRedux(XElement) {

    html() { return `
        <h1>Authorize Transaction</h1>
        <h2>Enter your passphrase below to authorize this transaction:</h2>
        
        <div class="transaction">
            <div class="center">
                <x-identicon sender></x-identicon>
                <i class="arrow material-icons">arrow_forward</i>
                <x-identicon recipient></x-identicon>
            </div>
        
            <div class="center">
                <div class="x-value"><span class="value"></span> NIM</div>
            </div>
        
            <div class="row">
                <label>From</label>
                <div class="row-data">
                    <div class="label" sender></div>
                    <x-address-no-copy sender></x-address-no-copy>
                </div>
            </div>
        
            <div class="row">
                <label>To</label>
                <div class="row-data">
                    <x-address-no-copy recipient></x-address-no-copy>
                </div>
            </div>
        
            <div class="fee-section display-none row">
                <label>Fee</label>
                <div class="row-data">
                    <div class="fee"></div>
                </div>
            </div>
        </div>
        
        <x-authenticate button-label="Confirm"></x-authenticate>
        `;
    }

    children() {
        return [ XIdenticon, XAddressNoCopy, XAuthenticate ];
    }

    onCreate() {
        this.$senderIdenticon = this.$identicon[0];
        this.$recipientIdenticon = this.$identicon[1];
        this.$senderLabel = this.$('.label[sender]');
        this.$senderAddress = this.$addressNoCopy[0];
        this.$recipientAddress = this.$addressNoCopy[1];

        super.onCreate();
    }

    static mapStateToProps(state) {
        return {
            requestType: state.request.requestType,
            transaction: state.request.data.transaction,
            myLabel: state.request.data.label
        };
    }

    static get actions() {
        return { signSafeTransaction, setData };
    }

    onAfterEntry() {
        setTimeout(() => this.$authenticate.focus(), 100);
    }

    _onPropertiesChanged(changes) {
        const { requestType } = this.properties;

        if (requestType !== RequestTypes.SIGN_SAFE_TRANSACTION) return;

        const { transaction, myLabel } = changes;

        if (transaction) {
            const { sender, recipient, value, fee } = transaction;

            this.$senderAddress.address = sender;
            this.$senderIdenticon.address = sender;

            this.$recipientAddress.address = recipient;
            this.$recipientIdenticon.address = recipient;

            this.$('.value').textContent = (value/1e5).toString();

            if (fee !== 0) {
                this.$('.fee-section').classList.remove('display-none');
                this.$('.fee').textContent = (fee/1e5).toString() + ' NIM';
            }
        }

        if (myLabel) {
            this.$senderLabel.textContent = this.properties.myLabel;
        }
    }

    listeners() {
        return {
            'x-authenticate-submitted': passphrase => this.actions.signSafeTransaction(passphrase)
        }
    }
}
