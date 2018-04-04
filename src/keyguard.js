import { RPC } from '/libraries/boruca-messaging/src/boruca.js';
import KeyguardApi from './requests/keyguard-api.js';
import AccessControl from './access-control/access-control.js';
import SafePolicy from './access-control/safe-policy.js';
import WalletPolicy from './access-control/wallet-policy.js';
import MinerPolicy from './access-control/miner-policy.js';
import config from './config.js';
import store from './store.js';
import XKeyguard from './x-keyguard.js';
import XNoRequest from './x-no-request.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';

class Keyguard {
    constructor() {

        // show UI if we are not embedded
        if (self === top) {
            const $appContainer = document.querySelector('#app');
            MixinRedux.store = store;

            // if there is no request, tell the user to go to dashboard?
            const noRequestTimer = setTimeout(() => {
                new XNoRequest($appContainer);
            }, 10000);

            // wait until request is started
            const unsubscribe = store.subscribe(() => {
                const state = store.getState();
                if (state.request.requestType) {
                    window.app = new XKeyguard($appContainer);
                    unsubscribe();
                    clearTimeout(noRequestTimer);
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
            },
            {
                origin: config.minerOrigin,
                policy: new MinerPolicy()
            }
        ];

        // cancel request when window is closed
        self.onunload = () => {
            const { reject, result }  = store.getState().request;
            if (reject && !result){
                reject(new Error('Keyguard window was closed.'));
            }
        };

        // cancel request and close window when there is an error
        self.onerror = (error) => {
            const { reject } = store.getState().request;
            if (reject) {
                reject(error);
                self.close();
            }
        };

        // cancel request and close window when there is an unhandled promise rejection
        self.onunhandledrejection = (event) => {
            const { reject } = store.getState().request;
            if (reject) {
                reject(new Error(event.reason));
                self.close();
            }
        };

        // start postMessage RPC server
        this._api = RPC.Server(AccessControl.addAccessControl(
            KeyguardApi, () => store.getState(), defaultPolicies
        ), true);

        // tell calling window that we are ready
        const client = self === top ? self.opener :  self.parent;
        client.postMessage('ready', '*');
    }
}

(async function() {
    if (window.Nimiq) {
        await Nimiq.load();
        switch (config.mode) {
            case 'main':
                Nimiq.GenesisConfig.main();
                break;
            case 'bounty':
                Nimiq.GenesisConfig.bounty();
                break;
            case 'test':
                Nimiq.GenesisConfig.test();
                break;
            case 'dev':
            default:
                Nimiq.GenesisConfig.dev();
        }
    }
    window.keyguard = new Keyguard();
})();
