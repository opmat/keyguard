import { RPC } from '/libraries/boruca-messaging/src/boruca.js';
import config from './config.js';

class Keystore {

    constructor() {
        // Check if we run in iframe or were opened by window.open()
        this._communicationTarget = window.parent || window.opener;

        class KeystoreApi {
            getAddresses(callingWindow, callingOrigin) {
                if (callingOrigin === config.vaultOrigin) {
                    // high secure keys
                    return [123, 352];
                }
            }
        };

        RPC.Server(KeystoreApi);
    }
}

new Keystore();
