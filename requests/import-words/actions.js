import { RequestTypes, setExecuting, setResult, setError } from '../request-redux.js';
import { Key, Keytype, keystore } from '../../keys/index.js';

export function importFromWords(passphrase, label) {
    return async (dispatch, getState) => {
        dispatch(setExecuting(RequestTypes.IMPORT_FROM_WORDS));

        try {
            const hexKey = getState().request.data.hexKey;

            const serializedKey = new Nimiq.SerialBuffer(Nimiq.BufferUtils.fromHex(hexKey));

            const privateKey = Nimiq.PrivateKey.unserialize(serializedKey);

            const keyPair = Nimiq.KeyPair.derive(privateKey);

            const key = await Key.loadPlain(keyPair.serialize());

            key.type = Keytype.HIGH;
            key.label = label;

            if (!key.label) {
                // todo get from ui
                key.label = key.userFriendlyAddress.slice(0, 9);
            }

            // actual import
            await keystore.put(key, passphrase);

            dispatch(
                setResult(RequestTypes.IMPORT_FROM_WORDS, key.getPublicInfo())
            );
        } catch (e) {
            dispatch(
                setError(RequestTypes.IMPORT_FROM_WORDS, e)
            );
        }
    }
}