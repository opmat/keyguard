import Policy from './policy.js';
import UI from './ui.js';

export default class ACL {
    static get constants() {
        return {
            policies: 'policies'
        }
    }

    static addACL(clazz) {
        debugger;
        return class KeystoreApi {
            constructor() {
                /** @type {Map<string,Policy> */
                this._appPolicies = new Map();

                const storedPolicies = self.localStorage.getItem(ACL.constants.policies);
                if (storedPolicies) {``
                    try {
                        this._appPolicies = new Map(JSON.parse(storedPolicies));
                    } catch(e) {
                        this._appPolicies = new Map();
                    }
                }

                self.addEventListener('storage', ({key, newValue}) =>
                    key === ACL.constants.policies && (this._appPolicies = JSON.parse(newValue)));
            }

            getPolicy(callingWindow, callingOrigin) {
                return this._appPolicies.get(callingOrigin);
            }

            async authorize(callingWindow, callingOrigin, policy) {
                // abort if embedded / request UI?!
                if (self.parent) return;

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
}

// policy short description => detailed interpretation

// TODO: Encrypt/sign policy data?