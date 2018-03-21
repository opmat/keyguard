import { importFromWords } from '/libraries/keyguard/store/request.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import XSetPassword from './x-set-password.js';

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
