import { RPC } from '/libraries/boruca-messaging/src/boruca.js';
import KeyguardApi from './keyguard-api.js';
import AccessControl from './access-control/access-control.js';
import SafePolicy from './access-control/safe-policy.js';
import WalletPolicy from './access-control/wallet-policy.js';
import config from './config.js';
import store from './store/store.js';
import accountStore from './keys/keystore.js';
import XKeyguardApp from './ui/x-keyguard-app.js';
import { KeyNotFoundError } from './errors/index.js';

class Keyguard {
    constructor() {

        // show UI if we are not embedded
        if (self === top) {
            window.app = XKeyguardApp.launch();
        }

        // configure access control
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

        // start postMessage RPC server
        RPC.Server(AccessControl.addAccessControl(KeyguardApi, () => store.getState(), defaultPolicies), true);
    }
}

(async function() {
    // to be removed
    await Nimiq.load();
    //GenesisConfig.dev();

    window.keyguard = new Keyguard();
})();

