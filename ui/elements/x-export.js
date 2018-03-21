import XElement from '/libraries/x-element/x-element.js';
import XRouter from '/elements/x-router/x-router.js';
import XIdenticon from '/elements/x-identicon/x-identicon.js';
import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import XPrivacyAgent from '/elements/x-privacy-agent/x-privacy-agent.js';
import XMnemonicPhrase from '/elements/x-mnemonic-phrase/x-mnemonic-phrase.js';
import { RequestTypes, decryptKey, setData, exportFile } from '/libraries/keyguard/store/request.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';

export default class XExport extends MixinRedux(XElement) {

    html() { return `
        <section x-route="export-key-phrase">
            <h1>Backup your Account</h1>
            <h2 secondary>Write down and physically store safely the following list of 24 Account Recovery Words to recover this account in the future.</h2>
            <x-mnemonic-phrase></x-mnemonic-phrase>
            <button class="last">Continue</button>
        </section>
        <section x-route="export-key-warning">
            <h1>Backup your Account</h1>
            <x-privacy-agent></x-privacy-agent>
        </section>
        <section x-route="export">
            <h1>Backup your Account</h1>
            <x-identicon></x-identicon>
            <section>
                <p>Please enter your passphrase to backup your account.</p>
                <x-password-setter buttonLabel="Backup" showIndicator="false"></x-password-setter>
            </section>
        </section>
        `;
    }

    children() {
        return [ XIdenticon, XPasswordSetter, XPrivacyAgent, XMnemonicPhrase ];
    }

    listeners() {
        return {
            'x-password-setter-submitted': passphrase => this.actions.decryptKey(passphrase),
            'x-surrounding-checked': () => XRouter.root.goTo('export-key-phrase'),
            'click button.last': () => this.actions.exportFile()
        };
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
        return { decryptKey, setData, exportFile };
    }

    _onPropertiesChanged(changes) {
        const { requestType } = this.properties;

        if (requestType !== RequestTypes.EXPORT) return;

        const { address, privateKey, isWrongPassphrase } = changes;

        if (isWrongPassphrase !== undefined) {
            this.$passwordSetter.setProperty('isWrongPassphrase', isWrongPassphrase);
        }

        if (address) {
            this.$identicon.address = address;
        }

        if (privateKey) {
            this.$mnemonicPhrase.setProperty('privateKey', privateKey);
        }
    }
}

// todo fix key -> mnemonic phrase