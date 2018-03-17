import XElement from '/libraries/x-element/x-element.js';
import XIdenticon from '/elements/x-identicon/x-identicon.js';
import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import store from '/libraries/keyguard/store/store.js';
import { RequestTypes, confirm } from '/libraries/keyguard/store/request.js';
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
        <button>Confirm</button>
        `;
    }

    onCreate() {
        this.setProperties({ sender: 'monkey pie', recipient: 'uncle sam', value: 1.06e6, fee: 101, validity: 15000 });
    }

    _onPropertiesChanged() {
        const { requestType, sender, recipient,  value, fee, validity } = this.properties;

        if (requestType !== RequestTypes.SIGN_TRANSACTION) return;

        this.$identicon[0].address = sender;
        this.$identicon[1].address = recipient;

        this.$('.value').innerText = value/1e5;
        this.$('.fee').innerText = fee;
        this.$('.validity').innerText = validity;
    }

    listeners() {
        return {
            'click button': _ => this.actions.confirm(RequestTypes.SIGN_TRANSACTION)
        }
    }

    children() {
        return [ XIdenticon ];
    }
}

/* connect the element to the redux store */
export default reduxify(
    store,
    state => {
        const data = state.request.data;
        return {
            sender: data.sender,
            recipient: data.recipient,
            value: data.value,
            requestType: state.request.requestType
        };
    },
    { confirm }
)(XSign)

// Todo confirm with passphrase: confirm
