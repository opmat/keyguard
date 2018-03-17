import XElement from '/libraries/x-element/x-element.js';
import XIdenticon from '/elements/x-identicon/x-identicon.js';
import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import store from '../../store/store.js';
import { confirmPersist } from '../../store/user-inputs.js';
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

    onCreate() { this._onPropertiesChanged(); }

    _onPropertiesChanged() {
        // TODO [max] hook in state, when done, remove test call in onCreate
        const properties = this.properties.length > 0 ? this.properties : { sender: 'monkey pie', recipient: 'uncle sam', value: 1.06e6, fee: 101, validity: 15000 }
        const { sender, recipient,  value, fee, validity } = properties;


        this.$identicon[0].address = sender;
        this.$identicon[1].address = recipient;

        this.$('.value').innerText = value/1e5;
        this.$('.fee').innerText = fee;
        this.$('.validity').innerText = validity;
    }

    listeners() {
        return { // TODO [max] put result into state
            'click button': _ => console.log('XSign confirmed')
        }
    }

    children() {
        return [ XIdenticon ];
    }
}


/* connect the element to the redux store */
export default reduxify(
    store,
    state => ({
        userFriendlyAddress: state.accounts.toBePersisted
    }),
    { confirmPersist }
)(XSign)
