import { RequestTypes, setData } from '/libraries/keyguard/requests/request-redux.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import XSetPassword from '../../common-elements/x-set-password.js';
import XRouter from '/elements/x-router/x-router.js';

export default class XPersistAccount extends MixinRedux(XSetPassword) {

    static mapStateToProps(state) {
        return {
            requestType: state.request.requestType,
            address: state.request.data.address
        };
    }

    static get actions() {
        return { onSubmit: passphrase => XPersistAccount._onSubmit(passphrase) };
    }

    static _onSubmit(passphrase) {
         setData(RequestTypes.CREATE, { passphrase });
         XRouter.root.goTo('set-label');
    }
}
