import { RPC } from '/libraries/boruca-messaging/src/boruca.js';
import KeystoreApi from './keystore-api.js';
import config from './config.js';
import ACL from './acl.js';

class Keystore {
    constructor() {
        // Check if we run in iframe or were opened by window.open()

        RPC.Server(ACL.addACL(KeystoreApi), true);
    }
}

new Keystore();
