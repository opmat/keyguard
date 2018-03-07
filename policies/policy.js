import WalletPolicy from './wallet-policy.js';
import SafePolicy from './safe-policy.js';

export default class Policy {
   constructor(name) {
      this.name = name;
   }

    equals(otherPolicy) {
        return otherPolicy && this.name === otherPolicy.name;
    }

    static parse(serialized) {
        if (!serialized) return null;
        const policy = Policy.get(serialized.name)
        for (const prop in serialized) policy[prop] = serialized[prop];
        return policy;
    }

    static get(name, ...args) {
        //return new (Object.bind.apply(Policy.predefined[name], args));
        //return new (Policy.predefined[name].bind, args));
        //return new (Object.bind(Policy.predefined[name].bind, args));
        //return new (Function.prototype.bind.apply(Policy.predefined[name], args));
        return new Policy.predefined[name](...args);
    }

    static get predefined() { return {
        'wallet': WalletPolicy,
        'vault': SafePolicy
    }}

    serialize() {
        const serialized = {};

        for (const prop in this)
            if (!(this[prop] instanceof Function)) serialized[prop] = this[prop];

        return serialized;
    }

    allows(method, args) {
        throw 'make a policy and overwrite me'
    }

    needsUi(method, args) {
        throw 'make a policy and overwrite me'
    }
}
