import { RequestTypes, setExecuting, setResult, setData } from '../request-redux.js';
import { Key, Keytype, keystore } from '../../keys/index.js';

export function exportWords() {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.EXPORT_WORDS) );

        const { encryptedKeyPair } = await keystore.getPlain(getState().request.data.address);

        dispatch(
            setResult(RequestTypes.EXPORT_WORDS, Nimiq.BufferUtils.toBase64(encryptedKeyPair))
        );
    }
}