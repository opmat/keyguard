import XElement from '/libraries/x-element/x-element.js';
import XMyAccount from '/libraries/keyguard/common-elements/x-my-account.js';
import XAuthenticate from '/libraries/keyguard/common-elements/x-authenticate.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setData } from '/libraries/keyguard/requests/request-redux.js';
import { rename } from './actions.js';

export default class XRename extends MixinRedux(XElement) {

    html() { return `
        <h1>Rename your Account</h1>
        <x-my-account></x-my-account>
        <section>
            <label>Name</label>
            <input type="text" placeholder="Account name">
        </section>
        <x-authenticate button-label="Save"></x-authenticate>
        `;
    }

    children() {
        return [ XMyAccount, XAuthenticate ];
    }

    onCreate() {
        this.$input = this.$('input');
        super.onCreate();
    }

    static get actions() {
        return { rename, setData };
    }

    listeners() {
        return {
            'x-password-setter-submitted': passphrase => this.actions.rename(passphrase, this.$input.value)
        }
    }
}
