import { RPC } from '/libraries/boruca-messaging/src/boruca.js';
import KeyguardApi from './keyguard-api.js';
import ACL from './acl.js';
import AccountStore from './account-store.js';

class Keystore {
    constructor() {

        this._state = {
            accounts: AccountStore.instance.accounts
        }

        RPC.Server(ACL.addACL(KeyguardApi, () => this._state), true);
    }
}

new Keystore();