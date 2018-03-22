import { RequestTypes, setExecuting, setResult, setData } from '../request-redux.js';
import { Key, Keytype, keystore } from '../../keys/index.js';

export function exportFile(passphrase) {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.EXPORT_FILE) );

        const { address, encryptedKeyPair } = getState().request.data;

        // try to decrypt to authenticate the user
        try {
            await keystore.get(address, passphrase);

            dispatch(
                setResult(RequestTypes.EXPORT_FILE, Nimiq.BufferUtils.toBase64(encryptedKeyPair))
            );
        } catch (e) {
            console.error(e);
            // assume the password was wrong
            dispatch(
                setData(RequestTypes.EXPORT_FILE, { isWrongPassphrase: true })
            );
        }
    }
}