import { RequestTypes, setExecuting, setResult, setData, loadAccountData, setError } from '../request-redux.js';
import { Key, KeyType, keyStore } from '../../keys/index.js';

// called after entering the pin
export function decrypt() {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.IMPORT_FROM_FILE) );

        const { encryptedKeyPair64, pin } = getState().request.data;

        try {
            const encryptedKeyPair = Nimiq.BufferUtils.fromBase64(encryptedKeyPair64);

            // test if we can decrypt
            const key = await Key.loadEncrypted(encryptedKeyPair, pin);

            dispatch(
                setData(RequestTypes.IMPORT_FROM_FILE, Object.assign({}, key.getPublicInfo(), {
                    label: 'Miner Account'
                }) )
            );

            dispatch(importFromFile());

        } catch (e) {
            console.error(e);
            // assume the password was wrong
            dispatch(
                setData(RequestTypes.IMPORT_FROM_FILE, { isWrongPin: true })
            );
        }
    }
}


export function importFromFile() {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.IMPORT_FROM_FILE) );

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
                setResult(RequestTypes.IMPORT_FROM_FILE, key.getPublicInfo())
            );
        } catch (e) {
            console.error(e);
            dispatch(
                setError(RequestTypes.IMPORT_FROM_FILE, e)
            );
        }
    }
}
