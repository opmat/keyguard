import { createStore, applyMiddleware, compose, combineReducers } from '/libraries/redux/src/index.js';
import { createLogger } from '/libraries/redux-logger/src/index.js';
import { reducer as accountReducer } from './accounts.js';
import { reducer as userInputsReducer } from './user-inputs.js';

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
const reducers = {
    accounts: accountReducer,
    userInputs: userInputsReducer
}

const logger = createLogger({
    collapsed: true,
    predicate: (getState, action) => true
})

export default function configureStore(initialState) {

    const createStoreWithMiddleware = compose(
        applyMiddleware(
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
