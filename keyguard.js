import { RPC } from '/libraries/boruca-messaging/src/boruca.js';
import KeyguardApi from './keyguard-api.js';
import ACL from './acl.js';
import State from './state.js';
import SafePolicy from './policies/safe-policy.js';
import WalletPolicy from './policies/wallet-policy.js';
import config from './config.js';
import { EventServer } from '/libraries/boruca-messaging/src/boruca.js';

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

        const ClassWithAccessControl = ACL.addACL(KeyguardApi, () => State, defaultPolicies);

        this._api = new ClassWithAccessControl(false);

        RPC.Server(ClassWithAccessControl, true);

        this._eventServer = new EventServer();

        self.addEventListener('storage', this._handleRequestsFromUI.bind(this));
    }

    async _handleRequestsFromUI(key, value) {
        if (key.substr(0, 7) !== 'request') return;
            const { id, method, origin, args } = JSON.parse(value);

            const result = await this._api[method](origin, ...args)

            this._eventServer.fire(`result-of-${id}`, { id, data: result });
        i

    }
}

new Keyguard();