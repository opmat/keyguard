import XElement from '/libraries/x-element/x-element.js';
import XIdenticon from '/elements/x-identicon/x-identicon.js';
import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setData } from '/libraries/keyguard/requests/request-redux.js';
import { rename } from './actions.js';

export default class XRenameAccount extends MixinRedux(XElement) {

    html() { return `
        <h1>Rename your Account</h1>
        <x-identicon></x-identicon>
        <section>
            <label>Name</label>
            <input type="text" placeholder="Account name">
        </section>
        <x-password-setter button-label="Import" show-indicator="false"></x-password-setter>
        `;
    }

    children() {
        return [ XIdenticon, XPasswordSetter ];
    }

    onCreate() {
        this.$input = this.$('input');
        super.onCreate();
    }

    static mapStateToProps(state) {
        return {
            requestType: state.request.requestType,
            address: state.request.data.address,
            label: state.request.data.label
        };
    }

    static get actions() {
        return { rename, setData };
    }

    _onPropertiesChanged(changes) {
        const { requestType } = this.properties;

        if (requestType !== RequestTypes.RENAME) return;

        const { address, label } = changes;

        if (address) {
            this.$identicon.address = address;
        }

        if (label) {
            this.$input.value = label;
        }
    }

    listeners() {
        return {
            'x-password-setter-submitted': passphrase => this.actions.rename(passphrase, this.$input.value)
        }
    }
}
