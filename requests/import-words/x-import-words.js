import XElement from '/libraries/x-element/x-element.js';
import XRouter from '/elements/x-router/x-router.js';
import XMnemonicInput from '/elements/x-mnemonic-input/x-mnemonic-input.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import { RequestTypes, deny, setData } from '/libraries/keyguard/requests/request-redux.js';

// TODO remove for production
import MnemonicPhrase from '/libraries/mnemonic-phrase/mnemonic-phrase.min.js';
window.test = async () => {
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

export default class XImportWords extends MixinRedux(XElement) {

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

    children() {
        return [ XMnemonicInput ];
    }

    static mapStateToProps(state) {
        return {
            requestType: state.request.requestType,
        };
    }

    static get actions() {
        return { deny, setData };
    }

    listeners() {
        return {
            'x-mnemonic-input': this._onSuccess.bind(this),
            'click button': () => this.actions.deny(RequestTypes.IMPORT_FROM_WORDS)
        }
    }

    _onSuccess(hexKey) {
        this.actions.setData(RequestTypes.IMPORT_FROM_WORDS, { hexKey });
        XRouter.root.goTo('save-recovered');
    }
}
