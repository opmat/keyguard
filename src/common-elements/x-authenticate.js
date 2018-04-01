import XPassphraseGetter from '/secure-elements/x-passphrase-getter/x-passphrase-getter.js';
import XToast from '/secure-elements/x-toast/x-toast.js';
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
            XToast.show('incorrect passphrase', 'error');
            this.actions.setData(this.properties.requestType, { isWrongPassphrase: false });
        }
    }
}