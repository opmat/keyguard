import { RequestTypes, setExecuting, setResult, setData } from '../request-redux.js';
import { Key, Keytype, keystore } from '../../keys/index.js';

// called when importing from file after entering the passphrase
export function importFromFile() {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.IMPORT_FROM_FILE) );

        // get encrypted key from request data set with _startRequest in keyguard-api
        // passphrase and label were entered by user
        const { encryptedKey, passphrase, label } = getState().request.data;

        try {
            const encryptedKeyPair = Nimiq.BufferUtils.fromBase64(encryptedKey);

            // test if we can decrypt
            const key = await Key.loadEncrypted(encryptedKeyPair, passphrase);

            key.type = Keytype.HIGH;
            key.label = label;

            if (!key.label) {
                // todo get from ui
                key.label = key.userFriendlyAddress.slice(0, 9);
            }

            // actual import
            const keyInfo = {
                encryptedKeyPair: encryptedKeyPair,
                userFriendlyAddress: key.userFriendlyAddress,
                type: key.type,
                label: key.label
            };

            await keystore.putPlain(keyInfo);

            dispatch(
                setResult(RequestTypes.IMPORT_FROM_FILE, key.getPublicInfo())
            );
        } catch (e) {
            console.error(e);
            // assume the password was wrong
            dispatch(
                setData(RequestTypes.IMPORT_FROM_FILE, { isWrongPassphrase: true })
            );
        }
    }
}