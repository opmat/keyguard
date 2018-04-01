import XPassphraseGetter from '/secure-elements/x-passphrase-getter/x-passphrase-getter.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';
import { setData } from '../requests/request-redux.js';

export default class XAuthenticate extends MixinRedux(XPassphraseGetter) {

    styles() {
        return [ 'x-passphrase-input' ];
    }

    static mapStateToProps(state) {
        return {
            isWrongPassphrase: state.request.data.isWrongPassphrase,
            requestType: state.request.requestType
        };
    }

    static get actions() {
        return { setData }
    }

    _onPropertiesChanged(changes) {
        if (changes.isWrongPassphrase) {
            this.wrongPassphrase();
            this.actions.setData(this.properties.requestType, { isWrongPassphrase: false });
        }
    }
}