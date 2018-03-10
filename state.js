class State {
    static get instance() {
        this._instance = this._instance || new State();
        return this._instance;
    }

    constructor() {
        this.volatileAccounts = new Map();
        this.exportAccount = {};
    }
}

export default State.instance;