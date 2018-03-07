import * as AccountType from './account-type.js';

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
        'full-access': FullAccess,
        'spending-limit': SpendingLimit,
        'wallet': WalletPolicy,
        'vault': VaultPolicy
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

class FullAccess extends Policy {
    constructor() { super('full-access'); }
    allows(method, args) { return true; }
    needsUi(method, args) { return false; }
}

class VaultPolicy extends Policy {
    constructor() { super('vault'); }

    allows(method, args) {
         switch (method) {
            case 'createNewAccounts':
            case 'triggerAccountImport':
            case 'persistAccount':
                return true;
            case 'sign':
                const { account, recipient, value, fee } = args;
                if (account.type === AccountType.High) return true;
                break;
            default:
                throw 'Unhandled method';
        }
    }

    needsUi(method, args) {
        switch (method) {
            case 'createNewAccounts':
                return false;
            case 'triggerAccountImport':
            case 'persistAccount':
            case 'sign':
                return true;
            default:
                throw 'Unhandled method';
        }
    }
}

class WalletPolicy extends Policy {
    constructor(limit) {
        super('wallet');
        this.limit = limit;
    }

    allows(method, args) {
        switch (method) {
            case 'createNewAccounts':
            case 'triggerAccountImport':
            case 'persistAccount':
                return true;
            case 'sign':
                const { account, recipient, value, fee } = args;
                if (account.type === AccountType.Low) return true;
                break;
            default:
                throw 'Unhandled method';
        }
    }

    needsUi(method, args) {
        switch (method) {
            case 'createNewAccounts':
            case 'triggerAccountImport':
            case 'persistAccount':
                return true;
            case 'sign':
                const { account, recipient, value, fee } = args;
                if (fee > this._limit) return true;
                break;
            default:
                throw 'Unhandled method';
        }
    }
}



class SpendingLimit extends Policy {
    constructor(limit) {
        super('spending-limit');
        this.limit = limit;
    }

    allows(method, args) { return true; }
    needsUi(method, args) {
        if (method === 'sign') {
            const { accont, recipient, value, fee } = args;
            return value > this._limit;
        }
        return false;
    }
}
