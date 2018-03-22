import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import XSetPassword from '../../common-elements/x-set-passphrase.js';
import { importFromWords } from './actions.js';

export default class XSaveRecovered extends MixinRedux(XSetPassword) {



    static get actions() {
        return { onSubmit: importFromWords };
    }
}

// todo goto set-label. Generic wrapper for setPassword AND setLabel as one?