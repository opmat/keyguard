import XElement from '/libraries/x-element/x-element.js';
import XRouter from '/secure-elements/x-router/x-router.js';
import XSetLabel from '/libraries/keyguard/src/common-elements/x-set-label.js';
import XSetPassphrase from '/libraries/keyguard/src/common-elements/x-set-passphrase.js';
import XPrivacyAgent from '/secure-elements/x-privacy-agent/x-privacy-agent.js';
import XShowWords from '/libraries/keyguard/src/common-elements/x-show-words.js';
import XDownloadFile from '/libraries/keyguard/src/common-elements/x-download-file.js';
import XIdenticons from './x-identicons/x-identicons.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setData } from '../request-redux.js';
import { createPersistent } from './actions.js';

export default class XCreate extends MixinRedux(XElement) {

    // todo fix router, so we can fix order. Last should be first
    html() { return `
          <x-identicons x-route=""></x-identicons>
          <section x-route="warning">
            <h1>Backup your Account</h1>
            <x-grow></x-grow>
            <x-privacy-agent></x-privacy-agent>
          </section>
          <x-set-passphrase x-route="set-passphrase"></x-set-passphrase>
          <x-set-label x-route="set-label"></x-set-label>
          <x-show-words x-route="words"></x-show-words>
          <section x-route="download">
            <x-download-file></x-download-file>
          </section>
        `;
    }

    children() {
        return [ XSetPassphrase, XSetLabel, XIdenticons, XPrivacyAgent, XShowWords, XDownloadFile ];
    }

    static mapStateToProps(state) {
        if (state.request.requestType !== RequestTypes.CREATE) return;

        const { address } = state.request.data;

        return {
            volatileKey: address && state.keys.volatileKeys.get(address),
            passphrase: state.request.data.passphrase
        }
    }

    static get actions() {
        return { setData, createPersistent };
    }

    async onCreate() {
        super.onCreate();
        this.router = await XRouter.instance;
    }

    listeners() {
        return {
            'x-choose-identicon': this._onChooseIdenticon.bind(this),
            'x-surrounding-checked': this._onSurroundingChecked.bind(this),
            'x-set-passphrase': this._onSetPassphrase.bind(this),
            'x-set-label': this._onSetLabel.bind(this),
            'x-show-words': this._onWordsSeen.bind(this),
            'x-file-download-complete': this._onFileDownload.bind(this)
        }
    }

    _onChooseIdenticon(address) {
        this.actions.setData(RequestTypes.CREATE, { address } );
        this.router.goTo(this, 'warning');
    }

    _onSurroundingChecked() {
        this.router.goTo(this, 'set-passphrase');
    }

    _onSetPassphrase(passphrase) {
        this.actions.setData(RequestTypes.CREATE, { passphrase });
        this.router.goTo(this, 'set-label');
    }

    _onSetLabel(label) {
        this.actions.setData(RequestTypes.CREATE, { label });
        this.actions.setData(RequestTypes.CREATE, {
            privateKey: this.properties.volatileKey.keyPair.privateKey.toHex()
        });
        this.router.goTo(this, 'words');
    }

    async _onWordsSeen() {
        const { volatileKey, passphrase} = this.properties;

        const encryptedKeyPair = await volatileKey.exportEncrypted(passphrase);

        this.actions.setData(RequestTypes.CREATE, {
            encryptedKeyPair
        });

        this.router.goTo(this, 'download');
    }

    _onFileDownload() {
        this.actions.createPersistent();
    }
}
