import { RequestTypes, setExecuting, setData } from '../request-redux.js';
import { keyStore } from '/libraries/keyguard/src/keys/index.js';

export function backupFile(pin) {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.BACKUP_FILE) );

        const { address } = getState().request.data;

        // try to decrypt to authenticate the user
        try {
            await keyStore.get(address, pin);

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
                setData(RequestTypes.BACKUP_FILE, { isWrongPin: true })
            );
        }
    }
}
