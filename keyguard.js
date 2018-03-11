import { RPC } from '/libraries/boruca-messaging/src/boruca.js';
import KeyguardApi from './keyguard-api.js';
import ACL from './acl.js';
import SafePolicy from './policies/safe-policy.js';
import WalletPolicy from './policies/wallet-policy.js';
import config from './config.js';
import state from './state.js';

class Keyguard {
    constructor() {

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


        this._rpcServer = RPC.Server(ACL.addACL(KeyguardApi, () => state, defaultPolicies), true);

        this._state = state;
    }
}

(async function() {
    // to be removed
    await Nimiq.load();
    window.keyguard = new Keyguard();
})();

