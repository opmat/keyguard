import XElement from '/libraries/x-element/x-element.js';
import XMnemonicInput from '/elements/x-mnemonic-input/x-mnemonic-input.js';
import store from '../../store/store.js';
import { bindActionCreators } from '/libraries/redux/src/index.js';
import { setPassword } from '../../store/user-inputs.js';

export default class XImportWords extends XElement {

    html() { return `
        <h1>Account Recovery Words</h1>
        <section>
            <p>Please enter your 24 Account Recovery Words.</p>
            <p>Press <code>Space</code> or <code>Tab</code> at the end of a word to jump to the next field.</p>
            <x-mnemonic-input class="x-recovery-phrase"></x-mnemonic-input>
        </section>
        `;
    }

    onCreate() {
        //this.actions = bindActionCreators({setPassword}, store.dispatch);
    }

    listeners() {
        return {
            'mnemonic-input': key => console.log(key)
        }
    }

    children() {
        return [ XMnemonicInput ];
    }
}
