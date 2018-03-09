import AccountStore from './account-store.js';

class State {
    static get instance() {
        this._instance = this._instance || new State();
    }

    constructor() {
        this.accounts = AccountStore.accounts;
        this.exportAccount = {};
    }
}

export default State.instance;
