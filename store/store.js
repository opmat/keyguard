import configureStore from './configure-store.js';

export class Store {
    static get instance() {
        this._instance = this._instance || configureStore();
        return this._instance;
    }

    static initialize(initialState) {
        Store._instance = configureStore(initialState);
        return Store._instance;
    }
}

export default Store.instance;