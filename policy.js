export default class Policy {
   constructor(name) {
      this.name = name;
   }

    equals(otherPolicy) {
        return otherPolicy && this.name === otherPolicy.name;
    }

<<<<<<< HEAD
=======
    static parse(object) {
        return new Policy(object.name);
    }

>>>>>>> c005015f07972643f68aa6feeaadf7aa3d21ca3d
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
<<<<<<< HEAD
    constructor() { super("full-access"); }
=======
    constructor() { super('full'); }
>>>>>>> c005015f07972643f68aa6feeaadf7aa3d21ca3d
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
