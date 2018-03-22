import XElement from '/libraries/x-element/x-element.js';
import XSetLabel from './common-elements/x-set-label.js';
import XPersistAccount from './requests/create/x-persist-account.js';
import XIdenticons from './requests/create/x-identicons/x-identicons.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setData } from '../request-redux.js';
import { createPersistent } from './actions.js';

export default class XCreate extends MixinRedux(XElement) {

    // todo fix router, so we can fix order. Last should be first
    html() { return `
          <x-persist-account x-route="create/persist"></x-persist-account>
          <x-save-recovered x-route="import-from-words/set-label"></x-save-recovered>
          <x-enter-phrase x-route="import-from-words"></x-enter-phrase>
        `;
    }

    children() {
        return [ XPersistAccount, XSetLabel, XIdenticons ];
    }

    static get actions() {
        return { setData, createPersistent };
    }

    listeners() {
        return {
            'x-set-label': this._onSetLabel.bind(this)
        }
    }

    _onSetLabel(label) {
        this.actions.setData(RequestTypes.CREATE, { label });
        this.actions.createPersistent();
    }
}
