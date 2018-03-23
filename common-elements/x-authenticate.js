import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';

export default class XAuthenticate extends MixinRedux(XPasswordSetter) {

    styles() {
        return [ 'x-password-setter' ];
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