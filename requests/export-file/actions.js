import { RequestTypes, setExecuting, setResult, setData } from '../request-redux.js';
import { Key, Keytype, keystore } from '../../keys/index.js';

export function exportFile(passphrase) {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.EXPORT_FILE) );

        try {
            const key = await keystore.get(getState().request.data.address, passphrase);

            dispatch(
                setData(RequestTypes.EXPORT_FILE, { privateKey: key.keyPair.privateKey.toHex() })
            );
        } catch (e) {
            // assume the password was wrong
            dispatch(
                setData(RequestTypes.EXPORT_FILE, { isWrongPassphrase: true })
            );
        }
    }
}