export default class Policy {
   constructor(name) {
      this.name = name;
   }

   equals(otherPolicy) {
       if (!otherPolicy) return false;

       return this.name === otherPolicy.name;
   }

   static parse(object) {
       return new Policy(object.name);
   }
}
