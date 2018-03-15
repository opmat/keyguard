import { RPC } from '/libraries/boruca-messaging/src/boruca.js';
import KeyguardApi from './keyguard-api.js';
import AccessControl from './access-control/access-control.js';
import SafePolicy from './access-control/safe-policy.js';
import WalletPolicy from './access-control/wallet-policy.js';
import config from './config.js';
import store from './store/store.js';
import accountStore from './accounts/account-store.js';
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
        ]

        // start postMessage RPC server
        RPC.Server(AccessControl.addAccessControl(KeyguardApi, () => store.getState(), defaultPolicies), true);

        if (self !== top) {
            // in iframe, listen for persist account command from other instance
            self.addEventListener('storage', this._handleLocalStoragePersist.bind(this));
        }
    }

    async _handleLocalStoragePersist({key, newValue}) {
        if (key !== 'persist') return;

        const { userFriendlyAddress, password } = JSON.parse(newValue);

        const account = store.getState().accounts.volatileAccounts.get(userFriendlyAddress);

        if (!account) throw new KeyNotFoundError();

        // todo encrypt key with password
        if (!await accountStore.put(account)) {
            throw new Error('Account could not be persisted');
        }
    }
}

(async function() {
    // to be removed
    await Nimiq.load();
    window.keyguard = new Keyguard();
})();

