import XElement from '/libraries/x-element/x-element.js';
import XAuthenticate from '/libraries/keyguard/src/common-elements/x-authenticate.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setData } from '../request-redux.js';
import KeyType from '/libraries/keyguard/src/keys/key-type.js';

export default class XDecryptSafe extends MixinRedux(XElement) {

    html() { return `
        <h1>Enter your Passphrase</h1>
        <h2>Please enter your passphrase to unlock your Account Access File.</h2>
        <x-grow></x-grow>
        <x-authenticate button-label="Import"></x-authenticate>
        `;
    }

    children() {
        return [ XAuthenticate ];
    }

    static mapStateToProps(state) {
        return {
            keyType: state.request.data.type
        }
    }

    listeners() {
        return {
            'x-authenticate-submitted': this._onSubmit.bind(this)
        };
    }

    onEntry() {
        if (this.properties.keyType !== KeyType.HIGH) {
            throw new Error('Key type does not match');
        }
    }

    static get actions() {
        return { setData };
    }

    _onSubmit(passphrase) {
        this.actions.setData(RequestTypes.IMPORT_FROM_FILE, { passphrase });
        this.fire('x-decrypt');
    }
}
