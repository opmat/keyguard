import XElement from '/libraries/x-element/x-element.js';
import XIdenticon from '/elements/x-identicon/x-identicon.js';
import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import store from '../../store/store.js';
import XPersistAccount from './x-persist-account.js';

export default class XPersistWrapper extends XElement {

    html() {
        return `
            <div>Data missing</div>
        `;
    }

    onCreate() {
        store.subscribe(() => {
            const state = store.getState();
            if (state.accounts.toBePersisted) {
                const wrappedElement = XPersistAccount.createElement(new Map()
                        .set('userFriendlyAddress', state.accounts.toBePersisted)
                );
                this.$el.textContent = '';
                this.$el.appendChild(wrappedElement.$el);
            }
        });

    }

    children() {
        return [ XIdenticon, XPasswordSetter ];
    }

}
