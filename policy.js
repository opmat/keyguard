export default class Policy {
   constructor(name) {
      this._name = name;
   }

   equals(otherPolicy) {
       if (!otherPolicy) return false;

       return this._name === otherPolicy._name;
   }

   static parse(object) {
       return new Policy(object._name);
   }
}
