import { RequestTypes, setExecuting, setResult, setData } from '../request-redux.js';
import { Key, Keytype, keystore } from '../../keys/index.js';

export function exportFile() {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.EXPORT_FILE) );

        const { encryptedKeyPair } = await keystore.getPlain(getState().request.data.address);

        dispatch(
            setResult(RequestTypes.EXPORT_FILE, Nimiq.BufferUtils.toBase64(encryptedKeyPair))
        );
    }
}