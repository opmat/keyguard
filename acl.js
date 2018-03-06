import Reflection from '/libraries/nimiq-utils/reflection/reflection.js';
import Policy from './policy.js';
import UI from './ui.js';

export default class ACL {
    static get STORAGE_KEY() {
        return 'policies';
    }

    static addACL(clazz) {
        const ClassWithAcl = class foo extends clazz {
            constructor() {
                super();
                this._isEmbedded = self !== top;

                const storedPolicies = self.localStorage.getItem(ACL.STORAGE_KEY);
                /** @type {Map<string,Policy> */
                this._appPolicies = storedPolicies ? ACL._parseAppPolicies(storedPolicies) : new Map();

                // Listen for policy changes from other instances
                self.addEventListener('storage', ({key, newValue}) =>
                    key === ACL.STORAGE_KEY && (this._appPolicies = ACL._parseAppPolicies(newValue)));
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
                    self.localStorage.setItem(ACL.STORAGE_KEY, JSON.stringify([...this._appPolicies]));
                }

                return userAuthorizesApp;
            }
        }

        for (const functionName of Reflection.userFunctions(clazz.prototype)) {
            ClassWithAcl.prototype[functionName] = function (callingWindow, callingOrigin, ...args) {
                const policy = this._appPolicies.get(callingOrigin);

                // TODO interprete policy
                if (!policy) throw 'Not authorized';

                return clazz.prototype[functionName](...args);
            }
        }

        // keep class name of clazz
        Object.defineProperty (ClassWithAcl, 'name', {value: clazz.name});

        return ClassWithAcl;
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
