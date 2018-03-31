import XValidateWords from '/secure-elements/x-validate-words/x-validate-words.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';

export default class XValidateWordsConnected extends MixinRedux(XValidateWords) {

    static mapStateToProps(state) {
        return {
            privateKey: state.request.data.privateKey,
        };
    }

    _onPropertiesChanged(changes) {
        const { privateKey } = changes;

        if (privateKey) {
            this.privateKey = privateKey;
        }
    }
}

