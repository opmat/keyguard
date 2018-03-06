import { RPC } from '/libraries/boruca-messaging/src/boruca.js';
import KeystoreApi from './keystore-api.js';
import ACL from './acl.js';

class Keystore {
    constructor() {
        RPC.Server(ACL.addACL(KeystoreApi), true);
    }
}

new Keystore();