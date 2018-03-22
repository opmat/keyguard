import XElement from '/libraries/x-element/x-element.js';
import XMyAccount from '/libraries/keyguard/common-elements/x-my-account.js';

export default class XSetLabel extends XElement {

    html() { return `
        <x-my-account></x-my-account>
        <h1>Name your Account</h1>
        <section>
            <label>Name</label>
            <input type="text" placeholder="Account name">
        </section>
        <button>Confirm</button>
        `;
    }

    children() {
        return [ XMyAccount ];
    }

    onCreate() {
        this.$input = this.$('input');
    }

    listeners() {
        return {
            'click button': e => this.fire('x-set-label', this.$input.value)
        }
    }
}
