import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';

export default class XAuthenticate extends MixinRedux(XPasswordSetter) {

    html() { return `
        <x-password-setter button-label="${ this.attributes.buttonLabel }" show-indicator="false"></x-password-setter>
        `;
    }

    children() {
        return [ XPasswordSetter ];
    }

    static mapStateToProps(state) {
        return {
            isWrongPassphrase: state.request.data.isWrongPassphrase
        };
    }

    _onPropertiesChanged(changes) {
        if (changes.isWrongPassphrase) {
            this.$passwordSetter.wrongPassphrase();
        }
    }
}
