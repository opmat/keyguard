import XPasswordGetter from '/elements/x-password-getter/x-password-getter.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';

export default class XAuthenticate extends MixinRedux(XPasswordGetter) {

    styles() {
        return [ 'x-password-input' ];
    }

    static mapStateToProps(state) {
        return {
            isWrongPassphrase: state.request.data.isWrongPassphrase
        };
    }

    _onPropertiesChanged(changes) {
        if (changes.isWrongPassphrase) {
            this.wrongPassphrase();
        }
    }
}