import XElement from '/libraries/x-element/x-element.js';
import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setData, encryptAndPersist } from '/libraries/keyguard/store/request.js';

export default class XImportFile extends MixinRedux(XElement) {

    html() { return `
        <h1>Enter your Passphrase</h1>
        <section>
            <p>Please enter your passphrase to unlock your Account Access File.</p>
        </section>
        <x-password-setter buttonLabel="Import" showIndicator="false"></x-password-setter>
        `;
    }

    children() {
        return [ XPasswordSetter ];
    }

    listeners() {
        return {
            'x-password-setter-submitted': passphrase => this.actions.encryptAndPersist(passphrase)
        };
    }

    static mapStateToProps(state) {
        return {
            requestType: state.request.requestType,
            isWrongPassphrase: state.request.data.isWrongPassphrase
        };
    }

    static get actions() {
        return { setData, encryptAndPersist };
    }

    _onPropertiesChanged(changes) {
        const { requestType } = this.properties;

        if (requestType !== RequestTypes.IMPORT_FROM_FILE) return;

        if (changes.isWrongPassphrase) {
            // todo show message in UI. Use html5 form validation api?
           alert('wrong passphrase')
           this.actions.setData(RequestTypes.IMPORT_FROM_FILE, { isWrongPassphrase: false });
        }
    }
}
