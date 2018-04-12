import { RequestTypes, setExecuting, setData, setResult, setError } from '../request-redux.js';
import { keyStore, KeyType } from '/libraries/keyguard/src/keys/index.js';

export function decrypt(pin, onSuccess) {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.UPGRADE) );

        const { address } = getState().request.data;

        // try to decrypt to authenticate the user
        try {
            const key = await keyStore.get(address, pin);

            dispatch(
                setData(RequestTypes.UPGRADE, { key, privateKey: key.keyPair.privateKey.toHex() })
            );

            onSuccess();
        } catch (e) {
            console.error(e);
            // assume the password was wrong
            dispatch(
                setData(RequestTypes.UPGRADE, { isWrongPin: true })
            );
        }
    }
}

export function encryptAndPersist() {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.UPGRADE) );

        const { key, passphrase } = getState().request.data;

        key.type = KeyType.HIGH;

        if (await keyStore.put(key, passphrase)) {
            dispatch(
                setResult(RequestTypes.UPGRADE, true)
            );
        } else {
            dispatch(
                setError(RequestTypes.UPGRADE, 'Key could not be persisted')
            );
        }
    }
}