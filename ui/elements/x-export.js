import XElement from '/libraries/x-element/x-element.js';
import XRouter from '/elements/x-router/x-router.js';
import XIdenticon from '/elements/x-identicon/x-identicon.js';
import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import XPrivacyAgent from '/elements/x-privacy-agent/x-privacy-agent.js';
import XMnemonicPhrase from '/elements/x-mnemonic-phrase/x-mnemonic-phrase.js';

import store from '../../store/store.js';
import { RequestTypes, confirm, confirmPersist } from '../../store/request.js';
import reduxify from '/libraries/redux/src/redux-x-element.js';

export default class XExport extends XElement {

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

    onCreate() {
        this._properties = { address: 'monkey pie', privateKey: window.crypto.getRandomValues(new Uint8Array(32)) };
        this._onPropertiesChanged();
    }

    _onPropertiesChanged() {
        const { address, privateKey } = this.properties;

        this.$identicon.address = address;
        this.$mnemonicPhrase.privateKey = privateKey;
    }

    listeners() {
        return {
            'x-password-setter-submitted': passphrase => {
                // TODO store and test passphrase
                console.log(`Export: Got passphrase ${passphrase}`);
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
// export default reduxify(
//     store,
//     state => ({
//         userFriendlyAddress: state.request.data.address
//     }),
//     { confirm, confirmPersist }
// )(XPersistAccount)