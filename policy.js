export default class Policy {
   constructor(name) {
      this.name = name;
   }

    equals(otherPolicy) {
        return otherPolicy && this.name === otherPolicy.name;
    }

    static parse(object) {
        return new Policy(object.name);
    }

    static get(name, ...args) {
        //return new Policy.predefined[name](args);
        return new (Policy.predefined[name].bind.apply(Policy.predefined[name], args));
    }

    static get predefined() { return {
        full: FullAccess
    }}

    allows(method, args) {
        throw 'make a policy and overwrite me'
    }

    needUi(method, args) {
        throw 'make a policy and overwrite me'
    }
}

class FullAccess extends Policy {
    constructor() { super('full'); }
    allows(method, args) { return true; }
    needUi(method, args) { return false; }
}

class SpendingLimit extends Policy {
    constructor(limit) {
        super('spending-limit');
        this.limit = limit;
    }
    set spendingLimit(limit) { this._limit = limit; }

    allows(method, args) { return true; }
    needUi(method, args) {
        if (method === 'sign') {
            const { sender, recipient, value, fee } = args;
            return value > this._limit;
        }
        return false;
    }
}
