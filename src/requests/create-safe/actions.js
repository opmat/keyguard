import { keyStore, KeyType } from '../../keys/index.js';
import { RequestTypes, setError, setResult, setExecuting } from '../request-redux.js';

export function createPersistent() {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.CREATE_SAFE) );

        const state = getState();
        const { address, label, passphrase } = state.request.data;
        const key = state.keys.volatileKeys.get(address);

        key.type = KeyType.HIGH;
        key.label = label;

        if (await keyStore.put(key, passphrase)) {
            const encryptedKeyPair = (await keyStore.getPlain(key.userFriendlyAddress)).encryptedKeyPair;
            dispatch(
                setResult(RequestTypes.CREATE_SAFE, Object.assign({}, key.getPublicInfo(), {
                    encryptedKeyPair
                }))
            );
        } else {
            dispatch(
                setError(RequestTypes.CREATE_SAFE, 'Key could not be persisted')
            );
        }
    }
}