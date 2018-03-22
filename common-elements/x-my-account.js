import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import XAccount from './x-account.js';

export default class XMyAccount extends MixinRedux(XAccount) {
    static mapStateToProps(state, props) {
        return {
            ...state.request.data
        }
    }
}