import { RequestTypes, setExecuting, setResult, setData, loadAccountData, setError } from '../request-redux.js';
import { Key, KeyType, keyStore } from '../../keys/index.js';
import XRouter from '/secure-elements/x-router/x-router.js';

// called after entering the pin
export function decrypt() {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.IMPORT_FROM_FILE_WALLET) );

        // get encrypted key from request data set with _startRequest in keyguard-api
        const { encryptedKeyPair64, pin } = getState().request.data;

        try {
            const encryptedKeyPair = Nimiq.BufferUtils.fromBase64(encryptedKeyPair64);

            // test if we can decrypt
            const key = await Key.loadEncrypted(encryptedKeyPair, pin);

            dispatch(
                setData(RequestTypes.IMPORT_FROM_FILE_WALLET, Object.assign({}, key.getPublicInfo()) )
            );

        } catch (e) {
            console.error(e);
            // assume the password was wrong
            dispatch(
                setData(RequestTypes.IMPORT_FROM_FILE_WALLET, { isWrongPin: true })
            );
        }
    }
}


export function importFromFile() {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.IMPORT_FROM_FILE_WALLET) );

        const { encryptedKeyPair64, pin, label } = getState().request.data;

        try {
            const encryptedKeyPair = Nimiq.BufferUtils.fromBase64(encryptedKeyPair64);

            const key = await Key.loadEncrypted(encryptedKeyPair, pin);

            key.type = KeyType.LOW;
            key.label = label;

            // actual import
            const keyInfo = {
                encryptedKeyPair: encryptedKeyPair,
                userFriendlyAddress: key.userFriendlyAddress,
                type: key.type,
                label: key.label
            };

            await keyStore.putPlain(keyInfo);

            dispatch(
                setResult(RequestTypes.IMPORT_FROM_FILE_WALLET, key.getPublicInfo())
            );
        } catch (e) {
            console.error(e);
            dispatch(
                setError(RequestTypes.IMPORT_FROM_FILE_WALLET, e)
            );
        }
    }
}
