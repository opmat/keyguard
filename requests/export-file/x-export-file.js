import XElement from '/libraries/x-element/x-element.js';
import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import XMyAccount from '/libraries/keyguard/common-elements/x-my-account.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import { RequestTypes } from '../request-redux.js';
import { exportFile } from './actions.js';

export default class XExportFile extends MixinRedux(XElement) {

    html() { return `
        <section x-route="export">
            <h1>Backup your Account</h1>
            <x-my-account></x-my-account>
            <section>
                <p>Please enter your passphrase to backup your account.</p>
                <x-password-setter button-label="Backup" show-indicator="false"></x-password-setter>
            </section>
        </section>
        `;
    }

    children() {
        return [ XPasswordSetter, XMyAccount ];
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

        const { isWrongPassphrase } = changes;

        if (isWrongPassphrase) {
            this.$passwordSetter.wrongPassphrase();
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
