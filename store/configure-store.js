import { createStore, applyMiddleware, compose, combineReducers } from '/libraries/redux/src/index.js';
import { createLogger } from '/libraries/redux-logger/src/index.js';
import thunk from '/libraries/redux/src/redux-thunk.js';
import { reducer as keyReducer } from './keys.js';
import { reducer as requestReducer } from './request.js';

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
const reducers = {
    keys: keyReducer,
    request: requestReducer
}

const logger = createLogger({
    collapsed: true,
    predicate: (getState, action) => true
})

export default function configureStore(initialState) {

    const createStoreWithMiddleware = compose(
        applyMiddleware(
            thunk,
            logger
        )
    )(createStore);

    // Combine all reducers and instantiate the app-wide store instance
    const allReducers = buildRootReducer(reducers);
    const store = createStoreWithMiddleware(allReducers, initialState);

    return store;
}

function buildRootReducer (allReducers) {
    return combineReducers(allReducers);
}
