import { RPC } from '/libraries/boruca-messaging/src/boruca.js';
import KeyguardApi from './keyguard-api.js';
import AccessControl from './access-control/access-control.js';
import SafePolicy from './access-control/safe-policy.js';
import WalletPolicy from './access-control/wallet-policy.js';
import config from './config.js';
import store from './store/store.js';
import XKeyguard from './ui/x-keyguard.js';
import MixinRedux from '/elements/mixin-redux/mixin-redux.js';
import keyStore from './keys/keystore.js';

class Keyguard {
    constructor() {

        // show UI if we are not embedded
        if (self === top) {
            const $appContainer = document.querySelector('#app');
            MixinRedux.store = store;
            // wait until request is started
            const unsubscribe = store.subscribe(() => {
                const state = store.getState();
                if (state.request.requestType) {
                    window.app = new XKeyguard($appContainer);
                    unsubscribe()
                }
            });
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
    Nimiq.GenesisConfig.bounty();

    window.keyguard = new Keyguard();
})();

