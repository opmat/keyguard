import XElement from '/libraries/x-element/x-element.js';
import XMnemonicInput from '/elements/x-mnemonic-input/x-mnemonic-input.js';
import reduxify from '/libraries/redux/src/redux-x-element.js';
import store from '/libraries/keyguard/store/store.js';
import { RequestTypes, deny, setData } from '/libraries/keyguard/store/request.js';

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
};

class XImportWords extends XElement {

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

    listeners() {
        return {
            'x-mnemonic-input': key => console.log('success', key),
            'click button': () => this.actions.deny(RequestTypes.IMPORT_FROM_WORDS)
        }
    }

    children() {
        return [ XMnemonicInput ];
    }
}

export default reduxify(
    store,
    null,
    { setData, deny }
)(XImportWords)
