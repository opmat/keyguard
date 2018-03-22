import XElement from '/libraries/x-element/x-element.js';
import XSetLabel from '/libraries/keyguard/common-elements/x-set-label.js';
import XEnterPhrase from './x-enter-phrase.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setData } from '../request-redux.js';
import { importFromWords } from './actions.js';
import XRouter from '/elements/x-router/x-router.js';

export default class XCreate extends MixinRedux(XElement) {

    // todo fix router, so we can fix order. Last should be first
    html() { return `
          <x-set-label x-route="import-from-words/set-label"></x-set-label>
          <x-set-passphrase x-route="import-from-words/set-passphrase"></x-set-passphrase>
          <x-enter-phrase x-route="import-from-words"></x-enter-phrase>
        `;
    }

    children() {
        return [ XSetLabel, XEnterPhrase ];
    }

    static get actions() {
        return { setData, importFromWords };
    }

    listeners() {
        return {
            'x-set-passphrase': this._onSetPassphrase.bind(this),
            'x-set-label': this._onSetLabel.bind(this)
        }
    }

    _onSetPassphrase(passphrase) {
        this.actions.setData(RequestTypes.CREATE, { passphrase });
        XRouter.root.goTo('import-from-words/set-label');
    }

    _onSetLabel(label) {
        this.actions.setData(RequestTypes.CREATE, { label });
        this.actions.importFromWords();
    }
}
