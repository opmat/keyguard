import XElement from '/libraries/x-element/x-element.js';
import XRouter from '/elements/x-router/x-router.js';
import XIdenticon from '/elements/x-identicon/x-identicon.js';
import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import XPrivacyAgent from '/elements/x-privacy-agent/x-privacy-agent.js';
import XMnemonicPhrase from '/elements/x-mnemonic-phrase/x-mnemonic-phrase.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setData, setResult } from '../request-redux.js';
import { exportWords } from './actions.js';

export default class XExportWords extends MixinRedux(XElement) {

    html() { return `
        <section x-route="export-words/words">
            <h1>Backup your Account</h1>
            <h2 secondary>Write down and physically store safely the following list of 24 Account Recovery Words to recover this account in the future.</h2>
            <x-mnemonic-phrase></x-mnemonic-phrase>
            <button class="last">Continue</button>
        </section>
        <section x-route="export-words/authenticate">
            <h1>Backup your Account</h1>
            <x-identicon></x-identicon>
            <section>
                <p>Please enter your passphrase to backup your account.</p>
                <x-password-setter button-label="Backup" show-indicator="false"></x-password-setter>
            </section>
        </section>
        <section x-route="export-words">
            <h1>Backup your Account</h1>
            <x-privacy-agent></x-privacy-agent>
        </section>
        `;
    }

    children() {
        return [ XIdenticon, XPasswordSetter, XPrivacyAgent, XMnemonicPhrase ];
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
        return { setData, setResult, exportWords };
    }

    _onPropertiesChanged(changes) {
        const { requestType } = this.properties;

        if (requestType !== RequestTypes.EXPORT_WORDS) return;

        const { address, privateKey, isWrongPassphrase } = changes;

        if (isWrongPassphrase) {
            this.$passwordSetter.wrongPassphrase();
        }

        if (address) {
            this.$identicon.address = address;
        }

        if (privateKey) {
            this.$mnemonicPhrase.setProperty('privateKey', privateKey);
        }
    }

    listeners() {
        return {
            'x-password-setter-submitted': passphrase => this.actions.exportWords(passphrase),
            'x-surrounding-checked': () => XRouter.root.goTo('export-words/authenticate'),
            'click button.last': () => this.actions.setResult(RequestTypes.EXPORT_WORDS, true)
        };
    }
}

