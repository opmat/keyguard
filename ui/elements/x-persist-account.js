import XElement from '/libraries/x-element/x-element.js';
import store from '../../store/store.js';
import { bindActionCreators } from '/libraries/redux/src/index.js';
import { setPassword } from '../../store/user-inputs.js';

export default class XPersistAccount extends XElement {

    onCreate() {
        this.actions = bindActionCreators({setPassword}, store.dispatch);
    }

    listeners() {
        return {
            'x-password-setter-valid': 'actions.setPassword'
        }

    }
}
