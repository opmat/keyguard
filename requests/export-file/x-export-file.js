import XElement from '/libraries/x-element/x-element.js';
import XIdenticon from '/elements/x-identicon/x-identicon.js';
import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import { RequestTypes } from '../request-redux.js';
import { exportFile } from './actions.js';

export default class XExportFile extends MixinRedux(XElement) {

    html() { return `
        <section x-route="export">
            <h1>Backup your Account</h1>
            <x-identicon></x-identicon>
            <section>
                <p>Please enter your passphrase to backup your account.</p>
                <x-password-setter button-label="Backup" show-indicator="false"></x-password-setter>
            </section>
        </section>
        `;
    }

    children() {
        return [ XIdenticon, XPasswordSetter ];
    }

    static mapStateToProps(state) {
        return {
            requestType: state.request.requestType,
            address: state.request.data.address,
            privateKey: state.request.data.privateKey,
            isWrongPassphrase: state.request.data.isWrongPassphrase
        };
    }

    static get actions() {
        return { exportFile };
    }

    _onPropertiesChanged(changes) {
        const { requestType } = this.properties;

        if (requestType !== RequestTypes.EXPORT_FILE) return;

        const { address, privateKey, isWrongPassphrase } = changes;

        if (isWrongPassphrase) {
            this.$passwordSetter.wrongPassphrase();
        }

        if (address) {
            this.$identicon.address = address;
        }
    }

    listeners() {
        return {
            'x-password-setter-submitted': this._onSubmit.bind(this),
        };
    }

    _onSubmit(passphrase) {
        this.actions.exportFile(passphrase);
    }
}

// todo test
