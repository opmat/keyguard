import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import XSetPassword from '../../common-elements/x-set-password.js';
import { importFromWords } from './actions.js';

export default class XSaveRecovered extends MixinRedux(XSetPassword) {

    static mapStateToProps(state) {
        return {
            requestType: state.request.requestType,
            address: state.request.data.address
        };
    }

    static get actions() {
        return { onSubmit: importFromWords };
    }
}

// todo goto set-label. Generic wrapper for setPassword AND setLabel as one?