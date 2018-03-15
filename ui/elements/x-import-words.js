import XElement from '/libraries/x-element/x-element.js';
import XMnemonicInput from '/elements/x-mnemonic-input/x-mnemonic-input.js';
import store from '../../store/store.js';
import { bindActionCreators } from '/libraries/redux/src/index.js';
import { setPassword } from '../../store/user-inputs.js';

// TODO remove for production
window.test = async () => {
    const MnemonicPhrase = (await import('/libraries/mnemonic-phrase/mnemonic-phrase.min.js')).default;
    const randomKey = window.crypto.getRandomValues(new Uint8Array(32));
    const hexKey = MnemonicPhrase._arrayToHex(randomKey);
    const testPassphrase = MnemonicPhrase.keyToMnemonic(hexKey).split(' ');
    function putWord(field, word, index) {
        setTimeout(() => {
            field.$input.value = word;
            field._value = word;
            field.__onValueChanged({type: 'blur'});
        }, index * 50);
    }
    const $mnemonicInput = document.body.querySelector('x-mnemonic-input').xDebug
    $mnemonicInput.$fields.forEach((field, index) => {
        putWord(field, testPassphrase[index], index);
    });
    document.querySelectorAll('button').forEach(button => button.setAttribute('disabled', 'disabled'));
}
// /remove

export default class XImportWords extends XElement {

    html() { return `
        <h1>Account Recovery</h1>
        <h2>Please enter your 24 Account Recovery Words.</h2>
        <section>
            Press <code>Space</code> or <code>Tab</code> at the end of a word to jump to the next field.
        </section>
        <x-mnemonic-input class="x-recovery-phrase"></x-mnemonic-input>
        <button>Cancel</button>
        `;
    }

    onCreate() {
        //this.actions = bindActionCreators({setPassword}, store.dispatch);
    }

    listeners() {
        return {
            'x-mnemonic-input': key => console.log('success', key),
            'click button': e => console.log('cancelled')
        }
    }

    children() {
        return [ XMnemonicInput ];
    }
}
