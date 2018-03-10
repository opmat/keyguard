class State {
    static get instance() {
        this._instance = this._instance || new State();
    }

    constructor() {
        this.volatileAccounts = new Map();
        this.exportAccount = {};
    }
}

export default State.instance;