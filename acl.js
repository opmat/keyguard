import Policy from './policy.js';
import UI from './ui.js';

export default class ACL {
    static get constants() {
        return {
            policies: 'policies'
        }
    }

    static addACL(clazz) {
        return class KeystoreApi {
            constructor() {
                this._isEmbedded = self !== top;

                const storedPolicies = self.localStorage.getItem(ACL.constants.policies);
                /** @type {Map<string,Policy> */
                this._appPolicies = storedPolicies ? ACL._parseAppPolicies(storedPolicies) : new Map();

                self.addEventListener('storage', ({key, newValue}) =>
                    key === ACL.constants.policies && (this._appPolicies = ACL._parseAppPolicies(newValue)));
            }

            getPolicy(callingWindow, callingOrigin) {
                return this._appPolicies.get(callingOrigin);
            }

            async authorize(callingWindow, callingOrigin, policy) {
                // abort if embedded
                if (this._isEmbedded) throw 'Authorization cannot be requested in iframe';

                const userAuthorizesApp = await UI.requestAuthorize(policy, callingOrigin);

                if (userAuthorizesApp) {
                    this._appPolicies.set(callingOrigin, policy);
                    self.localStorage.setItem('policies', JSON.stringify([...this._appPolicies]));
                }

                return userAuthorizesApp;
            }

            // example, TODO: iterate over all methods and wrap them
            getAddresses(callingWindow, callingOrigin) {
                const policy = this._appPolicies.get(callingOrigin);

                // TODO interprete policy

                if (!policy) throw 'Not authorized';

                // TODO add high/low security flag
                return clazz.prototype.getAddresses();
            }
        }
    }

    static _parseAppPolicies(encoded) {
        try {
            return new Map(JSON.parse(encoded));
        } catch (e) {
            return new Map();
        }
    }
}

// policy short description => detailed interpretation

// TODO: Encrypt/sign policy data?