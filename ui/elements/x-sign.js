import XElement from '/libraries/x-element/x-element.js';
import XIdenticon from '/elements/x-identicon/x-identicon.js';
import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import store from '/libraries/keyguard/store/store.js';
import { RequestTypes, signTransaction } from '/libraries/keyguard/store/request.js';
import reduxify from '/libraries/redux/src/redux-x-element.js';

class XSign extends XElement {

    html() { return `
        <x-identicon></x-identicon>
        &#8675;
        <x-identicon></x-identicon>
        <h1>Transaction</h1>
        <h2><span class="value"></span> NIM</h2>
        <section>
            <p><span class="fee"></span> satoshis fee</p>
            <p>Valid until block #<span class="validity"></span></p>
        </section>
        <x-password-setter buttonLabel="Import" showIndicator="false"></x-password-setter>
        `;
    }

    onCreate() {
        this.setProperties({ sender: 'monkey pie', recipient: 'uncle sam', value: 1.06e6, fee: 101, validity: 15000 });
    }

    _onPropertiesChanged(changes) {
        const { requestType } = this.properties;

        if (requestType !== RequestTypes.SIGN_TRANSACTION || !changes.transaction) return;

        const { transaction: { sender, recipient, value, fee, validity } } = changes;

        this.$identicon[0].address = sender;
        this.$identicon[1].address = recipient;

        this.$('.value').textContent = (value/1e5).toString();
        this.$('.fee').textContent = fee;
        this.$('.validity').textContent = validity;
    }

    listeners() {
        return {
            'x-password-setter-submitted': passphrase => this.actions.signTransaction(passphrase)
        }
    }

    children() {
        return [ XIdenticon, XPasswordSetter ];
    }
}

/* connect the element to the redux store */
export default reduxify(
    store,
    state => {
        return {
            transaction: state.request.data.transaction,
            requestType: state.request.requestType
        };
    },
    { signTransaction }
)(XSign)

// Todo confirm with passphrase: confirm
