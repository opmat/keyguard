import XElement from '/libraries/x-element/x-element.js';
import XIdenticon from '/elements/x-identicon/x-identicon.js';
import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import store from '../../store/store.js';
import { bindActionCreators } from '/libraries/redux/src/index.js';
import { setPassword } from '../../store/user-inputs.js';

export default class XPersistAccount extends XElement {

    html() { return `
        <x-identicon></x-identicon>
        <x-password-setter></x-password-setter>
        <button>Confirm</button>
        `;
    }

    onCreate() {
        this.$identicon.address = 'monkey pie';
        this.actions = bindActionCreators({setPassword}, store.dispatch);
    }

    listeners() {
        return {
            'x-password-setter-valid': 'actions.setPassword'
        }
    }

    children() {
        return [ XIdenticon, XPasswordSetter ];
    }

}
