import XElement from '/libraries/x-element/x-element.js';
import XRouter from '/elements/x-router/x-router.js';
import XIdenticon from '/elements/x-identicon/x-identicon.js';
import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import XPrivacyAgent from '/elements/x-privacy-agent/x-privacy-agent.js';
import XMnemonicPhrase from '/elements/x-mnemonic-phrase/x-mnemonic-phrase.js';

import store from '../../store/store.js';
import { RequestTypes, decryptKey } from '../../store/request.js';
import reduxify from '/libraries/redux/src/redux-x-element.js';

class XExport extends XElement {

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
        <section x-route="export-key">
            <h1>Backup your Account</h1>
            <x-identicon></x-identicon>
            <section>
                <p>Please enter your passphrase to backup your account.</p>
                <x-password-setter buttonLabel="Backup" showIndicator="false"></x-password-setter>
            </section>
        </section>
        `;
    }

    _onPropertiesChanged() {
        const { address, privateKey } = this.properties;

        this.$identicon.setProperty('address', address);
        this.$mnemonicPhrase.setProperty('privateKey', privateKey);
    }

    listeners() {
        return {
            'x-password-setter-submitted': passphrase => {
                console.log(`Export: Got passphrase ${passphrase}`);
                this.actions.decryptKey(passphrase);
                XRouter.root.goTo('export-key-warning');
            },
            'x-surrounding-checked': e => XRouter.root.goTo('export-key-phrase'),
            'click button.last': e => console.log("Export: done")
        }
    }

    children() {
        return [ XIdenticon, XPasswordSetter, XPrivacyAgent, XMnemonicPhrase ];
    }
}


/* connect the element to the redux store */
export default reduxify(
    store,
    state => ({
        address: state.request.data.address,
        privateKey: state.request.data.privateKey
    }),
    { decryptKey }
)(XExport)
