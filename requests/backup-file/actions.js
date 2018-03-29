import { RequestTypes, setExecuting, setResult, setData } from '../request-redux.js';
import { keystore } from '/libraries/keyguard/keys/index.js';
import XRouter from '/secure-elements/x-router/x-router.js';

export function backupFile(passphrase) {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.BACKUP_FILE) );

        const { address } = getState().request.data;

        // try to decrypt to authenticate the user
        try {
            await keystore.get(address, passphrase);

            // encryptedkeypair is already in store because of loadAccountData
            // but we need to get rid of executing
            dispatch(
                setData(RequestTypes.BACKUP_FILE, {})
            );

            (await XRouter.instance).goTo('backup-file/download')
        } catch (e) {
            console.error(e);
            // assume the password was wrong
            dispatch(
                setData(RequestTypes.BACKUP_FILE, { isWrongPassphrase: true })
            );
        }
    }
}