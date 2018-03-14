import XElement from '/libraries/x-element/x-element.js';
import XIdenticon from '/elements/x-identicon/x-identicon.js';
import XPasswordSetter from '/elements/x-password-setter/x-password-setter.js';
import store from '../../store/store.js';
import XPersistAccount from './x-persist-account.js';
import { clearPersist } from '../../store/accounts.js';
import { bindActionCreators } from '/libraries/redux/src/index.js';

export default class XPersistWrapper extends XElement {

    html() {
        return `
            <div>Data missing</div>
        `;
    }

    onCreate() {
        this.actions = bindActionCreators({ clearPersist }, store.dispatch);

        this._unsubscribe = store.subscribe(() => this._onStateChange(store.getState()));
   }

    children() {
        return [ XIdenticon, XPasswordSetter ];
    }

    async _onStateChange(state) {
        if (state.accounts.toBePersisted) {
            this.actions.clearPersist();

            const newAttributes = new Map()
                .set('userFriendlyAddress', state.accounts.toBePersisted);

            const { xRoute } = this.attributes;

            if (xRoute) newAttributes.set('xRoute', xRoute);

            const wrappedElement = XPersistAccount.createElement(newAttributes);
            this.$el.textContent = '';
            wrappedElement.$el.className = 'in';
            this.$el.parentNode.replaceChild(wrappedElement.$el, this.$el);
            this._unsubscribe();
        }
    }

}

// Idea: listen to mutation event to react to attribute change. Subscribe a mapStateToAttributes
