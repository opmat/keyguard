import XElement from '/libraries/x-element/x-element.js';
import XRouter from '/secure-elements/x-router/x-router.js';
import XDecryptWallet from './x-decrypt-wallet.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setData } from '/libraries/keyguard/src/requests/request-redux.js';
import { importFromFile, decrypt } from './actions.js';

export default class XImportFileWallet extends MixinRedux(XElement) {

    html() {
        return `
            <x-decrypt-wallet x-route=""></x-decrypt-wallet>
        `
    }

    children() {
        return [ XDecryptWallet ];
    }

    async onCreate() {
        super.onCreate();
        this.router = await XRouter.instance;
    }

    static get actions() {
        return { setData, importFromFile, decrypt };
    }

    listeners() {
        return {
            'x-decrypt': this._onDecrypt.bind(this)
        }
    }

    async _onDecrypt() {
        await this.actions.decrypt();
        this._onSetLabel('Miner Wallet');
    }

    _onSetLabel(label) {
        this.actions.setData(RequestTypes.IMPORT_FROM_FILE_WALLET, { label });
        this.actions.importFromFile();
    }
}
