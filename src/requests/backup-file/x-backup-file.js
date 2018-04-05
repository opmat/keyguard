import XElement from '/libraries/x-element/x-element.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';
import XAuthenticateBackup from '/libraries/keyguard/src/common-elements/x-authenticate-backup.js';
import { testPassPhrase } from './actions.js';

export default class XBackupFile extends MixinRedux(XElement) {

    html() { return `
        <x-authenticate-backup></x-authenticate-backup>
        `;
    }

    children() {
        return [ XAuthenticateBackup ];
    }

    static get actions() {
        return { testPassPhrase };
    }

    listeners() {
        return {
            'x-authenticate-submitted': this._onSubmit.bind(this)
        };
    }

    _onSubmit(passPhrase) {
        this.actions.testPassPhrase(passPhrase);
    }
}
