import { RPC } from '/libraries/boruca-messaging/src/boruca.js';
import KeyguardApi from './keyguard-api.js';
import AccessControl from './access-control/access-control.js';
import SafePolicy from './access-control/safe-policy.js';
import WalletPolicy from './access-control/wallet-policy.js';
import config from './config.js';
import store from './store/store.js';
import XKeyguardApp from './ui/x-keyguard-app.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import keyStore from './keys/keystore.js';

class Keyguard {
    constructor() {

        // show UI if we are not embedded
        if (self === top) {
            MixinRedux.store = store;
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
        this._api = RPC.Server(AccessControl.addAccessControl(KeyguardApi, () => store.getState(), defaultPolicies), true);
        this._keyStore = keyStore;
    }
}

(async function() {
    // to be removed
    await Nimiq.load();
    Nimiq.GenesisConfig.dev();

    window.keyguard = new Keyguard();
})();

