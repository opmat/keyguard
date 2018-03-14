import XElement from '/libraries/x-element/x-element.js';
import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import store from '../../store/store.js';
import { bindActionCreators } from '/libraries/redux/src/index.js';
import { setPassword } from '../../store/user-inputs.js';

export default class XImportFile extends XElement {

    html() { return `
        <h1>Enter your Passphrase</h1>
        <section>
            <p>Please enter your passphrase to import your Account Access File.</p>
        </section>
        <x-password-setter buttonLabel="Import" showIndicator="false"></x-password-setter>
        `;
    }

    onCreate() {
        this.actions = bindActionCreators({setPassword}, store.dispatch);
        store.subscribe(() => {
            const state = store.getState();
            if (state.feedback.wrongPassphrase)
                this.$xPasswordSetter.wrongPassphrase();
        });

    }

    listeners() {
        return {
            'x-password-setter-submitted': password => this.actions.setPassword(password)
        }
    }

    children() {
        return [ XPasswordSetter ];
    }

}
