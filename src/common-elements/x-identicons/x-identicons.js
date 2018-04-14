import XElement from '/libraries/x-element/x-element.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';
import XIdenticon from '/secure-elements/x-identicon/x-identicon.js';
import XAddressNoCopy from '/secure-elements/x-address-no-copy/x-address-no-copy.js';
import { createVolatile, clearVolatile } from '/libraries/keyguard/src/keys/keys-redux.js';
import { RequestTypes, setData } from '/libraries/keyguard/src/requests/request-redux.js';

export default class XIdenticons extends MixinRedux(XElement) {

    html() {
        return `
            <h1>Choose Your Account Avatar</h1>
            <h2>The Avatar will be 'unique' to this Account. You can not change it later.</h2>
            <x-grow></x-grow>
            <x-container>
                <div class="center" id="loading">
                    <x-loading-animation></x-loading-animation>
                    <h2>Mixing colors</h2>
                </div>
            </x-container>
            <x-grow></x-grow>
            <a secondary class="generate-more">Generate New</a>
            <x-grow></x-grow>

            <x-backdrop class="center">
                <a button>Confirm</a>
                <a secondary>Back</a>
            </x-backdrop>
            `;
    }

    onCreate() {
        this.$container = this.$('x-container');
        this.$loading = this.$('#loading');
        this.$confirmButton = this.$('x-backdrop [button]');
        super.onCreate();
    }

    listeners() {
        return {
            'click .generate-more': e => this._generateIdenticons(),
            'click x-backdrop': e => this._clearSelection()
        };
    }

    static mapStateToProps(state) {
        return {
            // volatileKeys is a map whose keys are addresses ;)
            addresses: [...state.keys.volatileKeys.keys()],
            requestType: state.request.requestType
        };
    }

    static get actions() {
        return { createVolatile, clearVolatile, setData };
    }

    _onPropertiesChanged(changes) {
        const { requestType } = this.properties;

        if (requestType !== RequestTypes.CREATE_SAFE && requestType !== RequestTypes.CREATE_WALLET) return;

        const { addresses } = changes;

        if (!addresses) return;

        this.$container.textContent = '';
        this.$el.removeAttribute('active');

        for (const address of this.properties.addresses) {
            const $identicon = XIdenticon.createElement();
            this.$container.appendChild($identicon.$el);
            $identicon.address = address;
            const $address = XAddressNoCopy.createElement();
            $address.address = address;
            $identicon.$el.appendChild($address.$el);
            $identicon.addEventListener('click', e => this._onIdenticonSelected($identicon));
        }

        setTimeout(() => this.$el.setAttribute('active', true), 100);
    }

    onEntry() {
        setTimeout(() => this._generateIdenticons(), 100);
    }

    onExit(){
        this.$container.textContent = '';
    }

    async _generateIdenticons() {
        this.actions.clearVolatile(this.properties.requestType);
        this.actions.createVolatile(this.properties.requestType, 7);
    }

    _onIdenticonSelected($identicon) {
        this.$('x-identicon.returning') && this.$('x-identicon.returning').classList.remove('returning');
        this.$confirmButton.onclick = () => this.fire('x-choose-identicon', $identicon.address);
        this._selectedIdenticon = $identicon;
        this.$el.setAttribute('selected', true);
        $identicon.$el.setAttribute('selected', true);
    }

    _clearSelection() {
        this._selectedKeyPair = null;
        if (!this._selectedIdenticon) return;
        this._selectedIdenticon.$el.classList.add('returning');
        this.$el.removeAttribute('selected');
        this._selectedIdenticon.$el.removeAttribute('selected');
    }
}

// Todo: [low priority] remove hack for overlay and find a general solution
