import Boruca from '/libraries/boruca-messaging/src/boruca.js';
import config from './config.js';

class Keystore {

    constructor() {
        // Check if we run in iframe or were opened by window.open()
        this._communicationTarget = window.parent || window.opener;

        const that = this;

        this.KeyStoreApi = class {
            getAddresses() {
                if (that._communicationTarget.origin === config.vaultOrigin) {
                    // high secure keys
                    return [123, 352];
                }
            }
        };


        if (this._communicationTarget) {
            this._connect();
        }
    }

    async _connect() {
        await Boruca.proxy(this._communicationTarget, this._communicationTarget.origin, this.KeyStoreApi);
    }
}

new Keystore();
