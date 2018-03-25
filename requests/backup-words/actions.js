import { RequestTypes, setExecuting, setResult, setData } from '../request-redux.js';
import { Key, Keytype, keystore } from '../../keys/index.js';
import XRouter from '/elements/x-router/x-router.js';

export function backupWords(passphrase) {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.BACKUP_WORDS) );

        try {
            const key = await keystore.get(getState().request.data.address, passphrase);

            dispatch(
                setData(RequestTypes.BACKUP_WORDS, { privateKey: key.keyPair.privateKey.toHex() })
            );

            XRouter.root.goTo('backup-words/words');
        } catch (e) {
            console.error(e);
            // assume the password was wrong
            dispatch(
                setData(RequestTypes.BACKUP_WORDS, { isWrongPassphrase: true })
            );
        }
    }
}