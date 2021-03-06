import { SATOSHIS, RequestTypes, setExecuting, setResult, setData } from '../request-redux.js';
import { keyStore } from '../../keys/index.js';

// called after confirming a transaction sign request (BASIC transaction)
export function signWalletTransaction(pin ) {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.SIGN_WALLET_TRANSACTION) );

        const { transaction: { recipient, value, fee, validityStartHeight }, address } = getState().request.data;

        try {
            const key = await keyStore.get(address, pin);
            const tx = await key.createTransaction(recipient, value, fee, validityStartHeight, 'basic');

            dispatch(
                setResult(RequestTypes.SIGN_WALLET_TRANSACTION, {
                    sender: tx.sender.toUserFriendlyAddress(),
                    senderPubKey: tx.senderPubKey.serialize(),
                    recipient: tx.recipient.toUserFriendlyAddress(),
                    value: tx.value / SATOSHIS,
                    fee: tx.fee / SATOSHIS,
                    validityStartHeight: tx.validityStartHeight,
                    signature: tx.signature.serialize(),
                    hash: tx.hash().toBase64()
                })
            )
        } catch (e) {
            // assume the password was wrong
            console.error(e);
            dispatch(
                setData(RequestTypes.SIGN_WALLET_TRANSACTION, { isWrongPin: true })
            );
        }
    }
}
