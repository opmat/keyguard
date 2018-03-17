import XElement from '/libraries/x-element/x-element.js';
import XIdenticon from '/elements/x-identicon/x-identicon.js';
import store from '../../store/store.js';
// import { confirmRename } from '../../store/user-inputs.js';
import reduxify from '/libraries/redux/src/redux-x-element.js';

export default class XRenameAccount extends XElement {

    html() { return `
        <h1>Rename your Account</h1>
        <x-identicon></x-identicon>
        <section>
            <label>Name</label>
            <input type="text" placeholder="Account name">
        </section>
        <button>Rename</button>
        `;
    }

    onCreate() {
        this.$input = this.$('input');
        // TODO remove after reduxify
        this._onPropertiesChanged();
    }

    _onPropertiesChanged() {
        const properties = this.properties.length > 0 ? this.properties : { address: 'monkey pie', label: 'old name' };
        const { address, label } = properties;

        this.$identicon.address = address;
        this.$input.value = label;
    }

    listeners() {
        return { // TODO [max] connect
            'click button': e => console.log(`${this.constructor.name}: account renamed to ${ this.$input.value}`)
        }
    }

    children() {
        return [ XIdenticon ];
    }
}


/* connect the element to the redux store */
// TODO [max] conntect
// export default reduxify(
//     store,
//     state => ({
//         address: ...
//         label: ...
//     }),
//     { confirmRename }
// )(XRenameAccount)
