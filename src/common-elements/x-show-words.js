import XElement from '/libraries/x-element/x-element.js';
import XMnemonicPhrase from '/secure-elements/x-mnemonic-phrase/x-mnemonic-phrase.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';

export default class XShowWords extends MixinRedux(XElement) {

    html() { return `
        <h1>Backup your 24 Recovery Words</h1>
        <h2 secondary>Write down and physically store the complete following list of 24 Account Recovery Words at a <strong>SAFE and SECRET</strong> place to recover this account in the future.</h2>
        <x-grow></x-grow>
        <x-mnemonic-phrase></x-mnemonic-phrase>
        <div class="spacing-bottom center warning">
            <strong>Anyone with access to these words can steal all your funds!</strong>
        </div>
        <x-grow x-grow="2"></x-grow>
        <button>Continue</button>
        `;
    }

    children() {
        return [ XMnemonicPhrase ];
    }

    static mapStateToProps(state) {
        return {
            privateKey: state.request.data.privateKey,
        };
    }

    _onPropertiesChanged(changes) {
        const { privateKey } = changes;

        if (privateKey) {
            this.$mnemonicPhrase.setProperty('privateKey', privateKey);
        }
    }

    listeners() {
        return {
            'click button': () => this.fire('x-show-words')
        };
    }
}

