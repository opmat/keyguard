import { RequestTypes, setExecuting, setResult, setData } from '../request-redux.js';
import { keyStore } from '/libraries/keyguard/src/keys/index.js';

export function testPassPhrase(passphrase) {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.BACKUP_FILE) );

        const { address, encryptedKeyPair } = getState().request.data;

        // try to decrypt to authenticate the user
        try {
            await keyStore.get(address, passphrase);

            const encodedWalletKey = `#2${ Nimiq.BufferUtils.toBase64(encryptedKeyPair) }`;

            dispatch(
                setResult(RequestTypes.BACKUP_FILE, encodedWalletKey)
            );
        } catch (e) {
            console.error(e);
            // assume the password was wrong
            dispatch(
                setData(RequestTypes.BACKUP_FILE, { isWrongPassphrase: true })
            );
        }
    }
}