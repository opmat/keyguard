import Policy from './policy.js';
import UI from './ui.js';

export default class ACL {
    static addACL(clazz) {
        return class KeystoreApi {
            constructor() {
                /** @type {Map<origin,Policy> */
                this._appPolicies = new Map();
            }

            getPolicy(callingWindow, callingOrigin) {
                return this._appPolicies.get(callingOrigin);
            }

            async authorize(policy, callingWindow, callingOrigin) {
                // abort if embedded / request UI?!
                if (self.parent) return;

                return await UI.requestAuthorize(policy, callingOrigin);
            }

            // example, TODO: iterate over all methods and wrap them
            getAddresses(callingWindow, callingOrigin) {
                // todo interprete policy
                if (this._appPolicies.get(callingOrigin)) {
                    return clazz.prototype.getAddresses();
                }
            }
        }
    }
}

// policy short description => detailed interpretation

// TODO: Persist _appPolicies in localStorage
// TODO: Listen to 'storage' event