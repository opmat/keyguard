import XElement from '/libraries/x-element/x-element.js';
import XRouter from '/secure-elements/x-router/x-router.js';
import XSetLabel from '/libraries/keyguard/src/common-elements/x-set-label.js';
import XDecrypt from './x-decrypt.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setData } from '/libraries/keyguard/src/requests/request-redux.js';
import { importFromFile, decrypt } from './actions.js';

export default class XImportFile extends MixinRedux(XElement) {

    html() {
        return `
            <x-decrypt x-route=""></x-decrypt>
            <x-set-label x-route="set-label"></x-set-label>
        `
    }

    children() {
        return [ XSetLabel, XDecrypt ];
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
            'x-decrypt': this._onDecrypt.bind(this),
            'x-set-label': this._onSetLabel.bind(this)
        }
    }

    _onDecrypt() {
        this.actions.decrypt();
    }

    _onSetLabel(label) {
        this.actions.setData(RequestTypes.IMPORT_FROM_FILE, { label });
        this.actions.importFromFile();
    }
}
