import XElement from '/libraries/x-element/x-element.js';
import XPinpad from '/secure-elements/x-pinpad/x-pinpad.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';

export default class XAuthenticatePin extends MixinRedux(XElement) {

    html() {
        return `
            <x-pinpad></x-pinpad>
        `
    }

    children() { return [ XPinpad ] }

    onCreate() {
        this.$pinpad.open();
        super.onCreate();
    }

    static mapStateToProps(state) {
        return {
            isWrongPin: state.request.data.isWrongPin
        };
    }

    _onPropertiesChanged(changes) {
        if (changes.isWrongPin) {
            this.$pinpad.onPinIncorrect();
        }
    }

    listeners() {
        return {
            'x-pin': (pin) => this.fire('x-authenticate-pin-submitted', pin)
        }
    }
}
