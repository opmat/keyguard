import XElement from '/libraries/x-element/x-element.js';
import XIdenticon from '/elements/x-identicon/x-identicon.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';

export default class XSetLabel extends MixinRedux(XElement) {

    html() { return `
        <x-identicon></x-identicon>
        <h1>Name your Account</h1>
        <section>
            <label>Name</label>
            <input type="text" placeholder="Account name">
        </section>
        <button>Confirm</button>
        `;
    }

    children() {
        return [ XIdenticon ];
    }

    onCreate() {
        this.$input = this.$('input');
    }

    _onPropertiesChanged(changes) {
        const { address } = changes;

        if (address) {
            this.$identicon.address = address;
        }
    }

    listeners() {
        return {
            'click button': e => this.fire('x-set-label', this.$input.value)
        }
    }
}
