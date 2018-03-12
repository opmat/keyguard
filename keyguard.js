import { RPC } from '/libraries/boruca-messaging/src/boruca.js';
import KeyguardApi from './keyguard-api.js';
import AccessControl from './access-control/access-control.js';
import SafePolicy from './access-control/safe-policy.js';
import WalletPolicy from './access-control/wallet-policy.js';
import config from './config.js';
import state from './state.js';
import XKeyguardApp from './ui/x-keyguard-app.js';
import { bindActionCreators } from '/libraries/redux/src/index.js';
import { Store, default as store } from './store/store.js';
import { add, remove } from './store/sample-reducer.js';

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

        RPC.Server(AccessControl.addAccessControl(KeyguardApi, () => state, defaultPolicies), true);

        window.app = XKeyguardApp.launch();

        /*
        Store.initialize({
            sample: {
                myMap: new Map(),
                counter: 5
            }
        });*/

        function update () {
            console.log('state change detected');
        }

        store.subscribe(update);
    }
}

(async function() {
    // to be removed
    //await Nimiq.load();
    window.keyguard = new Keyguard();
})();

