import { RPC } from '/libraries/boruca-messaging/src/boruca.js';
import KeystoreApi from './keyguard-api.js';
import ACL from './acl.js';
import * as AccountType from './account-type.js';

class Keystore {
    constructor() {

        this._state = {
            accounts: new Map()
        }

        RPC.Server(ACL.addACL(KeystoreApi, () => this._state), true);

        this._state.accounts.set('[123]', {
            number: 123,
            type: AccountType.high
        });

        // todo design internal architecture - e.g. use inner api class?
    }
}

new Keystore();