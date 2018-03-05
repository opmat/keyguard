export default class Policy {
   constructor(name) {
      this._name = name;
   }

   equals(otherPolicy) {
      return this._name === otherPolicy._name;
   }

   static parse(object) {
       return new Policy(object._name);
   }
}
