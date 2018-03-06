export default class Policy {
   constructor(name) {
      this.name = name;
   }

    equals(otherPolicy) {
        return otherPolicy && this.name === otherPolicy.name;
    }

    static parse(serialized) {
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
        "full-access": FullAccess,
        "spending-limit": SpendingLimit
    }}

    serialize() {
        const serialized = {};
        for (const prop in this) if (!(this[prop] instanceof Function)) serialized[prop] = this[prop];
        return serialized;
    }

    allows(method, args) {
        throw 'make a policy and overwrite me'
    }

    needUi(method, args) {
        throw 'make a policy and overwrite me'
    }
}

class FullAccess extends Policy {
    constructor() { super('full-access'); }
    allows(method, args) { return true; }
    needUi(method, args) { return false; }
}

class SpendingLimit extends Policy {
    constructor(limit) {
        super('spending-limit');
        this.limit = limit;
    }

    allows(method, args) { return true; }
    needUi(method, args) {
        if (method === 'sign') {
            const { sender, recipient, value, fee } = args;
            return value > this._limit;
        }
        return false;
    }
}
