import XElement from '/libraries/x-element/x-element.js';
import XSetLabel from '/libraries/keyguard/src/common-elements/x-set-label.js';
import XSetPassphrase from '/libraries/keyguard/src/common-elements/x-set-passphrase.js';
import XEnterWords from './x-enter-words.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setData } from '../request-redux.js';
import { createKey, importFromWords } from './actions.js';
import XRouter from '/secure-elements/x-router/x-router.js';
import XPrivacyAgent from '/secure-elements/x-privacy-agent/x-privacy-agent.js';

export default class XImportWords extends MixinRedux(XElement) {

    html() {
        return `
            <section x-route="">
                <h1>Account Recovery</h1>
                <x-grow></x-grow>
                <x-privacy-agent></x-privacy-agent>
            </section>
            <x-enter-words x-route="enter-words"></x-enter-words>
            <x-set-passphrase x-route="set-passphrase"></x-set-passphrase>
            <x-set-label x-route="set-label"></x-set-label>
        `;
    }

    children() {
        return [ XPrivacyAgent, XSetLabel, XEnterWords, XSetPassphrase ];
    }

    static get actions() {
        return { setData, createKey, importFromWords };
    }

    listeners() {
        return {
            'x-surrounding-checked': async () => (await XRouter.instance).goTo(this, 'enter-words'),
            'x-enter-words': this._onEnterWords.bind(this),
            'x-set-passphrase': this._onSetPassphrase.bind(this),
            'x-set-label': this._onSetLabel.bind(this)
        }
    }

    _onEnterWords() {
        this.actions.createKey();
    }

    async _onSetPassphrase(passphrase) {
        this.actions.setData(RequestTypes.IMPORT_FROM_WORDS, { passphrase });
        (await XRouter.instance).goTo(this, 'set-label');
    }

    _onSetLabel(label) {
        this.actions.setData(RequestTypes.IMPORT_FROM_WORDS, { label });
        this.actions.importFromWords();
    }
}
