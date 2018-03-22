import XElement from '/libraries/x-element/x-element.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setData } from '/libraries/keyguard/requests/request-redux.js';
import { importFromFile } from './actions.js';

export default class XImportFile extends MixinRedux(XElement) {

    html() {
        return `
            <x-set-label x-route="import-file/set-label"></x-set-label>
            <x-unlock x-route="import-file"></x-unlockx>
        `
    }

    static get actions() {
        return { setData, importFromFile };
    }

    listeners() {
        return {
            'x-set-label': this._onSetLabel.bind(this)
        }
    }

    _onSetLabel(label) {
        this.actions.setData(RequestTypes.CREATE, { label });
        this.actions.importFromFile();
    }
}