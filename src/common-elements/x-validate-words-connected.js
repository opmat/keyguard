import XValidateWords from '/secure-elements/x-validate-words/x-validate-words.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';
import Config from '/libraries/secure-utils/config/config.js';

export default class XValidateWordsConnected extends MixinRedux(XValidateWords) {

    static mapStateToProps(state) {
        return {
            privateKey: state.request.data.privateKey
        };
    }

    _onPropertiesChanged(changes) {
        const { privateKey } = changes;

        if (privateKey) {
            this.privateKey = privateKey;
        }
    }
}

if (Config.network !== 'main') {
    window.pass = () => {
        const $validateWords = document.body.querySelector('x-validate-words-connected').xDebug
        $validateWords.fire('x-validate-words');
    }
}