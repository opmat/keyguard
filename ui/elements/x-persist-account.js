import { createPersistent } from '/libraries/keyguard/store/request.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import XInputKeyInfo from './x-input-key-info.js';

export default class XPersistAccount extends MixinRedux(XInputKeyInfo) {

    static mapStateToProps(state) {
        return {
            requestType: state.request.requestType,
            address: state.request.data.address
        };
    }

    static get actions() {
        return { onSubmit: createPersistent };
    }
}
