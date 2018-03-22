import XElement from '/libraries/x-element/x-element.js';
import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import XMyAccount from '/libraries/keyguard/common-elements/x-my-account.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import { RequestTypes } from '../request-redux.js';
import { exportFile } from './actions.js';

export default class XExportFile extends MixinRedux(XElement) {

    html() { return `
        <section x-route="export">
            <h1>Backup your Account</h1>
            <x-my-account></x-my-account>
            <section>
                <p>Please enter your passphrase to backup your account.</p>
                <x-password-setter button-label="Backup" show-indicator="false"></x-password-setter>
            </section>
        </section>
        `;
    }

    children() {
        return [ XPasswordSetter, XMyAccount ];
    }

    static get actions() {
        return { exportFile };
    }

    listeners() {
        return {
            'x-password-setter-submitted': this._onSubmit.bind(this),
        };
    }

    _onSubmit(passphrase) {
        this.actions.exportFile(passphrase);
    }
}
