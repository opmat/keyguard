import XElement from '/libraries/x-element/x-element.js';
import XIdenticon from '/elements/x-identicon/x-identicon.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import { RequestTypes, rename, setData } from '/libraries/keyguard/store/request.js';

export default class XRenameAccount extends MixinRedux(XElement) {

    html() { return `
        <h1>Rename your Account</h1>
        <x-identicon></x-identicon>
        <section>
            <label>Name</label>
            <input type="text" placeholder="Account name">
        </section>
        <x-password-setter buttonLabel="Import" showIndicator="false"></x-password-setter>
        `;
    }

    onCreate() {
        super.onCreate();
        this.$input = this.$('input');
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
        const { requestType, address, label } = this.properties;

        if (requestType !== RequestTypes.RENAME) return;

        this.$identicon.setProperty('address', address);
        this.$input.value = label;
    }

    listeners() {
        return { // TODO [max] connect
            'x-password-setter-submitted': passphrase => this.actions.rename(passphrase, this.$input.value)
        }
    }

    children() {
        return [ XIdenticon ];
    }
}
