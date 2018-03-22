import XElement from '/libraries/x-element/x-element.js';
import XRouter from '/elements/x-router/x-router.js';
import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import XMyAccount from '/libraries/keyguard/common-elements/x-my-account.js';
import XShowWords from '/libraries/keyguard/common-elements/x-show-words.js';
import XPrivacyAgent from '/elements/x-privacy-agent/x-privacy-agent.js';
import XMnemonicPhrase from '/elements/x-mnemonic-phrase/x-mnemonic-phrase.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setData, setResult } from '../request-redux.js';
import { exportWords } from './actions.js';

export default class XExportWords extends MixinRedux(XElement) {

    html() { return `
        <x-show-words x-route="export-words/words"></x-show-words>
        <section x-route="export-words/authenticate">
            <h1>Backup your Account</h1>
            <x-my-account></x-my-account>
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
        return [ XPasswordSetter, XPrivacyAgent, XMnemonicPhrase, XMyAccount, XShowWords ];
    }

    static get actions() {
        return { setData, setResult, exportWords };
    }

    listeners() {
        return {
            'x-password-setter-submitted': passphrase => this.actions.exportWords(passphrase),
            'x-surrounding-checked': () => XRouter.root.goTo('export-words/authenticate'),
            'x-show-words': () => this.actions.setResult(RequestTypes.EXPORT_WORDS, true)
        };
    }
}

