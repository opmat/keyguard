import { RequestTypes, setExecuting, setResult, setError } from '../request-redux.js';
import { Key, Keytype, keystore } from '../../keys/index.js';

export function rename(passphrase) {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.RENAME) );
        // todo implement
    }
}