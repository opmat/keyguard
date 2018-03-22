import XElement from '/libraries/x-element/x-element.js';
import XRouter from '/elements/x-router/x-router.js';
import XSetLabel from '/libraries/keyguard/common-elements/x-set-label.js';
import XSetPassphrase from '/libraries/keyguard/common-elements/x-set-passphrase.js';
import XIdenticons from './x-identicons/x-identicons.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setData } from '../request-redux.js';
import { createPersistent } from './actions.js';

export default class XCreate extends MixinRedux(XElement) {

    // todo fix router, so we can fix order. Last should be first
    html() { return `
          <x-set-label x-route="create/set-label"></x-set-label>
          <x-set-passphrase x-route="create/set-passphrase"></x-set-passphrase>
          <x-identicons x-route="create"></x-identicons>
        `;
    }

    children() {
        return [ XSetPassphrase, XSetLabel, XIdenticons ];
    }

    static get actions() {
        return { setData, createPersistent };
    }

    listeners() {
        return {
            'x-choose-identicon': this._onChooseIdenticon.bind(this),
            'x-set-passphrase': this._onSetPassphrase.bind(this),
            'x-set-label': this._onSetLabel.bind(this)
        }
    }

    _onChooseIdenticon(address) {
        this.actions.setData(RequestTypes.CREATE, { address } );
        XRouter.root.goTo('create/set-passphrase');
    }

    _onSetPassphrase(passphrase) {
        this.actions.setData(RequestTypes.CREATE, { passphrase });
        XRouter.root.goTo('create/set-label');
    }

    _onSetLabel(label) {
        this.actions.setData(RequestTypes.CREATE, { label });
        this.actions.createPersistent();
    }
}
