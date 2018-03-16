import XElement from '/libraries/x-element/x-element.js';
import XIdenticon from '/elements/x-identicon/x-identicon.js';
import reduxify from '/libraries/redux/src/redux-x-element.js';
import store from '/libraries/keyguard/store/store.js';
import XRouter from '/elements/x-router/x-router.js';
import { createVolatile } from '/libraries/keyguard/store/keys.js';

class XIdenticons extends XElement {

    html() {
        return `
            <h1>Choose Your Account Avatar</h1>
            <h2>The Avatar will be 'unique' to this Account. You can not change it later.</h2>
            <x-container>
                <div class="center" id="loading">
                    <x-loading-animation></x-loading-animation>
                    <h2>Mixing colors</h2>
                </div>
            </x-container>
            <a secondary class="generate-more">Generate New</a>
            <x-backdrop class="center">
                <x-address></x-address>
                <a button>Confirm</a>
                <a secondary>Back</a>
            </x-backdrop>
            `
    }

    onCreate() {
        this.$container = this.$('x-container');
        this.$loading = this.$('#loading');
        this.$address = this.$('x-address');
        this.$confirmButton = this.$('x-backdrop [button]');
    }

    listeners() {
        return {
            'click .generate-more': e => this._generateIdenticons(),
            'click x-backdrop': e => this._clearSelection()
        }
    }

    onEntry() {
        this._generateIdenticons();
    }

    onExit(){
        this._clearIdenticons();
    }

    _onPropertiesChanged() {
        const { addresses } = this.properties;

        this.$container.textContent = '';

        for (const address of addresses) {
            const $identicon = XIdenticon.createElement();
            this.$container.appendChild($identicon.$el);
            $identicon.address = address;
            $identicon.addEventListener('click', e => this._onIdenticonSelected(address, $identicon));
        }

        setTimeout(e => this.$el.setAttribute('active', true), 100);
    }

    async _generateIdenticons() {
        this.actions.createVolatile(7);
    }

    _onIdenticonSelected(address, $identicon) {
        this.$('x-identicon.returning') && this.$('x-identicon.returning').classList.remove('returning');
        this.$confirmButton.onclick = () => this._onConfirm(address);
        this._selectedIdenticon = $identicon;
        this.$el.setAttribute('selected', true);
        $identicon.$el.setAttribute('selected', true);
        this.$address.textContent = address;
    }

    _clearSelection() {
        this._selectedKeyPair = null;
        if (!this._selectedIdenticon) return;
        this._selectedIdenticon.$el.classList.add('returning');
        this.$el.removeAttribute('selected');
        this._selectedIdenticon.$el.removeAttribute('selected');
    }

    async _onConfirm(address) {
        // this.actions.confirm(password, label);
        XRouter.root.goTo('persist');
    }
}

export default reduxify(
    store,
    state => ({
        addresses: [...state.keys.volatileKeys.keys()]
    }),
    { createVolatile }
)(XIdenticons);

// Todo: [low priority] remove hack for overlay and find a general solution

// Todo: use store provider which recursively sets store in all children? Or decouple store import in a different way
