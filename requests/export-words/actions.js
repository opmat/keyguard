import { RequestTypes, setExecuting, setResult, setData } from '../request-redux.js';
import { Key, Keytype, keystore } from '../../keys/index.js';
import XRouter from '/elements/x-router/x-router.js';

export function exportWords(passphrase) {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.EXPORT_WORDS) );

        try {
            const key = await keystore.get(getState().request.data.address, passphrase);

            dispatch(
                setData(RequestTypes.EXPORT_WORDS, { privateKey: key.keyPair.privateKey.toHex() })
            );

            XRouter.root.goTo('export-words/words');
        } catch (e) {
            console.error(e);
            // assume the password was wrong
            dispatch(
                setData(RequestTypes.EXPORT_WORDS, { isWrongPassphrase: true })
            );
        }
    }
}