import XElement from '/libraries/x-element/x-element.js';
import XPinpad from '/secure-elements/x-pinpad/x-pinpad.js';
import XToast from '/secure-elements/x-toast/x-toast.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';
import { setData } from '../requests/request-redux.js';

export default class XAuthenticatePin extends MixinRedux(XElement) {

    html() {
        return `
            <x-pinpad></x-pinpad>
        `
    }

    children() { return [ XPinpad ] }

    static mapStateToProps(state) {
        return {
            isWrongPin: state.request.data.isWrongPin,
            requestType: state.request.requestType
        };
    }

    static get actions() {
        return { setData }
    }

    _onPropertiesChanged(changes) {
        if (changes.isWrongPin) {
            this.$pinpad.onPinIncorrect();
            XToast.show('incorrect pin', 'error');
            this.actions.setData(this.properties.requestType, { isWrongPin: false });
        }
    }

    listeners() {
        return {
            'x-pin': (pin) => this.fire('x-authenticate-pin-submitted', pin)
        }
    }
}
