import XElement from '/libraries/x-element/x-element.js';
import XSetLabel from '/libraries/keyguard/common-elements/x-set-label.js';
import XDecrypt from './x-decrypt.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setData } from '/libraries/keyguard/requests/request-redux.js';
import { importFromFile, decrypt } from './actions.js';

export default class XImportFile extends MixinRedux(XElement) {

    html() {
        return `
            <x-set-label x-route="import-from-file/set-label"></x-set-label>
            <x-decrypt x-route="import-from-file"></x-decrypt>
        `
    }

    children() {
        return [ XSetLabel, XDecrypt ];
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