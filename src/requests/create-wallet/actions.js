import { keyStore, KeyType } from '../../keys/index.js';
import { RequestTypes, setError, setResult, setExecuting } from '../request-redux.js';

export function createWalletPersistent() {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.CREATE_WALLET) );

        const state = getState();
        const { address, label, pin } = state.request.data;
        const key = state.keys.volatileKeys.get(address);

        key.type = KeyType.LOW;
        key.label = label;

        if (await keyStore.put(key, pin)) {
            dispatch(
                setResult(RequestTypes.CREATE_WALLET, Object.assign({}, key.getPublicInfo()))
            );
        } else {
            dispatch(
                setError(RequestTypes.CREATE_WALLET, 'Key could not be persisted')
            );
        }
    }
}