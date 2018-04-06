import XElement from '/libraries/x-element/x-element.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';
import XAuthenticateBackupPin from '/libraries/keyguard/src/common-elements/x-authenticate-backup-pin.js';
import { testPin } from './actions.js';

export default class XBackupFile extends MixinRedux(XElement) {

    html() { return `
        <x-authenticate-backup-pin></x-authenticate-backup-pin>
        `;
    }

    children() {
        return [ XAuthenticateBackupPin ];
    }

    static get actions() {
        return { testPin };
    }

    listeners() {
        return {
            'x-authenticate-submitted': this._onSubmit.bind(this)
        };
    }

    _onSubmit(pin) {
        this.actions.testPin(pin);
    }
}
