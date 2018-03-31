import { keyStore, KeyType } from '../../keys/index.js';
import { RequestTypes, setError, setResult, setExecuting } from '../request-redux.js';

export function createPersistent() {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.CREATE_WALLET) );

        const state = getState();
        const { address, label, passphrase } = state.request.data;
        const key = state.keys.volatileKeys.get(address);

        key.type = KeyType.LOW;
        key.label = label;

        if (await keyStore.put(key, passphrase)) {
            const encryptedKeyPair = (await keyStore.getPlain(key.userFriendlyAddress)).encryptedKeyPair;
            dispatch(
                setResult(RequestTypes.CREATE_WALLET, Object.assign({}, key.getPublicInfo(), {
                    encryptedKeyPair
                }))
            );
        } else {
            dispatch(
                setError(RequestTypes.CREATE_WALLET, 'Key could not be persisted')
            );
        }
    }
}