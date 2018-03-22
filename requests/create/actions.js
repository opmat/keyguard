import { keystore, Keytype } from '../../keys/index.js';
import { RequestTypes, setError, setResult, setExecuting } from '../request-redux.js';

// called in account creation after choosing identicon and entering passphrase and label
export function createPersistent(passphrase, label = '') {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.CREATE) );

        const state = getState();
        const { address } = state.request.data;
        const key = state.keys.volatileKeys.get(address);

        key.type = Keytype.HIGH;
        key.label = label;

        if (!key.label) {
            key.label = key.userFriendlyAddress.slice(0, 9);
        }

        if (await keystore.put(key, passphrase)) {
            const encryptedKeyPair = (await keystore.getPlain(key.userFriendlyAddress)).encryptedKeyPair;
            dispatch(
                setResult(RequestTypes.CREATE, {
                    ...key.getPublicInfo(),
                    encryptedKeyPair
                })
            );
        } else {
            dispatch(
                setError(RequestTypes.CREATE, 'Key could not be persisted')
            );
        }
    }
}