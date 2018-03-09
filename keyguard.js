import { RPC } from '/libraries/boruca-messaging/src/boruca.js';
import KeyguardApi from './keyguard-api.js';
import ACL from './acl.js';
import AccountStore from './account-store.js';
import SafePolicy from './policies/safe-policy.js';
import WalletPolicy from './policies/wallet-policy.js';
import config from './config.js';

class Keyguard {
    constructor() {

        this._state = {
            accounts: AccountStore.instance.accounts
        }

        const defaultPolicies = [
            {
                origin: config.safeOrigin,
                policy: new SafePolicy()
            },
            {
                origin: config.walletOrigin,
                policy: new WalletPolicy(1000)
            }
        ];


        RPC.Server(ACL.addACL(KeyguardApi, () => this._state, defaultPolicies), true);
    }
}

new Keyguard();