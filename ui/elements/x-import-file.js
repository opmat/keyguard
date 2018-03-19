import XElement from '/libraries/x-element/x-element.js';
import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import store from '/libraries/keyguard/store/store.js';
import reduxify from '/libraries/redux/src/redux-x-element.js';
import { RequestTypes, setData, encryptAndPersist } from '/libraries/keyguard/store/request.js';

class XImportFile extends XElement {

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
        }
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

export default reduxify(
    store,
    state => ({
        requestType: state.request.requestType,
        isWrongPassphrase: state.request.data.isWrongPassphrase
    }),
    { setData, encryptAndPersist }
)(XImportFile)
