import XElement from '/libraries/x-element/x-element.js';
import XIdenticon from '/elements/x-identicon/x-identicon.js';
import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import store from '../../store/store.js';
import { bindActionCreators } from '/libraries/redux/src/index.js';
//import { add } from '../../store/sample-reducer.js';

export default class XPersistAccount extends XElement {

    onCreate() {
        this.$button = this.$('button');
        //this.$button.addEventListener('click', () => actions.add('efwf', 1));

        this.$identicon.address = 'monkey pie';
    }

    html() { return `
        <x-identicon></x-identicon>
        <x-password-setter></x-password-setter>
        <button>Confirm</button>
        `;
    }

    children() {
        return [ XIdenticon, XPasswordSetter ];
    }

}
