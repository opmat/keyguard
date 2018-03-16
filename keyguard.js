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

        if (self !== top) {
            // in iframe, listen for persist account command from other instance
            self.addEventListener('storage', this._handleLocalStoragePersist.bind(this));
        }

        // start postMessage RPC server
        RPC.Server(AccessControl.addAccessControl(KeyguardApi, () => store.getState(), defaultPolicies), true);
    }

    async _handleLocalStoragePersist({key, newValue}) {
        if (key !== KeyguardApi.Persist || newValue === '') return;

        localStorage.removeItem(KeyguardApi.Persist);

        const { userFriendlyAddress, password, type, label } = JSON.parse(newValue);

        // get account which shall be persisted
        const account = store.getState().accounts.volatileAccounts.get(userFriendlyAddress);

        account.type = type;
        account.label = label;

        if (!account) throw new KeyNotFoundError();

        // todo encrypt key with password

        // persist in indexedDB and return success to window instance
        if (await accountStore.put(account)) {
            localStorage.setItem(KeyguardApi.PersistResponse, '1');
        } else {
            localStorage.setItem(KeyguardApi.PersistResponse, '0');
        }
    }
}

(async function() {
    // to be removed
    await Nimiq.load();
    window.keyguard = new Keyguard();
})();

