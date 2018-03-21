import keystore from '../keys/keystore.js';
import * as Keytype from '../keys/keytype.js';
import Key from '../keys/key.js';
import XRouter from '/elements/x-router/x-router.js';

// Requests which need UI
export const RequestTypes = {
    SIGN_TRANSACTION: 'sign-transaction',
    SIGN_MESSAGE: 'sign-message',
    CREATE: 'create',
    IMPORT_FROM_FILE: 'import-from-file',
    IMPORT_FROM_WORDS: 'import-from-words',
    EXPORT: 'export',
    RENAME: 'rename'
};

// basic action types
export const TypeKeys = {
    START: 'request/start',
    SET_DATA: 'request/setData',
    SET_EXECUTING: 'request/executing',
    SET_RESULT: 'request/result',
    SET_ERROR: 'request/error',
};

export function reducer(state, action) {
    const initialState = {
        requestType: undefined, // type of current request, set when it starts and won't change

        executing: false, // true if we are doing async actions which can take longer, like storing in keystore

        error: undefined, // setting an error here will throw it at the calling app

        result: undefined, // result which is returned to calling app (keyguard-api will be notified when state changes)

        reject: undefined, // used to cancel the request when the window is closed

        data: { // additional request data specific to some request types
            address: undefined, // the address of the account we are using for this request
            isWrongPassphrase: undefined, // boolean set to true after user tried wrong passphrase
            privateKey: undefined, // unencrypted; we need it to show mnemonic phrase
            label: undefined, // label BEFORE rename
            type: undefined // key type (high/low)
        }
    };

    if (state === undefined) {
        return initialState;
    }

    // check if request type of action matches running request, if present
    if (action.type !== TypeKeys.START && state.requestType !== action.requestType) {
        return {
            error: new Error('Request type does not match')
        };
    }

    // describe state changes for each possible action
    switch (action.type) {
        case TypeKeys.START:
            if (state.requestType) {
                return {
                    ...initialState,
                    error: new Error('Multiple Requests')
                };
            }

            return {
                ...state,
                requestType: action.requestType,
                reject: action.reject,
                data: {
                    ...state.data,
                    ...action.data
                }
            };

        case TypeKeys.SET_DATA:
            return {
                ...state,
                executing: false,
                data: {
                    ...state.data,
                    ...action.data
                }
            };

        case TypeKeys.SET_EXECUTING:
            return {
                ...state,
                executing: true
            };

        case TypeKeys.SET_RESULT:
            return {
                ...state,
                result: action.result
            };

        case TypeKeys.SET_ERROR:
            return {
                ...state,
                error: action.error
            };

        default:
            return state
    }
}

export function start(requestType, reject, data) {
    return {
        type: TypeKeys.START,
        requestType,
        reject,
        data
    };
}

export function setData(requestType, data) {
    return {
        type: TypeKeys.SET_DATA,
        requestType,
        data
    };
}

export function deny(requestType) {
    return setError(requestType, new Error('Denied by user'));
}

export function setResult(requestType, result) {
    return {
        type: TypeKeys.SET_RESULT,
        requestType,
        result
    }
}

export function setError(requestType, error) {
    return {
        type: TypeKeys.SET_ERROR,
        requestType,
        error
    }
}

export function setExecuting(requestType) {
    return {
        type: TypeKeys.SET_EXECUTING,
        requestType
    }
}

// The following actions are async

// called in account creation after choosing identicon and entering passphrase (and label)
export function confirmPersist(passphrase, label = '') {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.CREATE) );

        const state = getState();
        const { address } = state.request.data;
        const key = state.keys.volatileKeys.get(address);

        key.type = Keytype.HIGH;
        key.label = label;

        if (!key.label) {
            key.label = key.userFriendlyAddress.slice(0, 9);
        }

        if (await keystore.put(key, passphrase)) {
            const encryptedKeyPair = (await keystore.getPlain(key.userFriendlyAddress)).encryptedKeyPair;
            dispatch(
                setResult(RequestTypes.CREATE, {
                    ...key.getPublicInfo(),
                    encryptedKeyPair
                })
            );
        } else {
            dispatch(
                setError(RequestTypes.CREATE, 'Key could not be persisted')
            );
        }
    }
}

// called when importing from file after entering the passphrase
export function encryptAndPersist(passphrase) {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.IMPORT_FROM_FILE) );

        try {
            // get encrypted key from request data set with _startRequest in keyguard-api
            const encryptedKey64 = getState().request.data.encryptedKey;
            const encryptedKey = Nimiq.BufferUtils.fromBase64(encryptedKey64);
            const key = Key.loadEncrypted(encryptedKey, passphrase);
            await keystore.put(encryptedKey);
            dispatch(
                setResult(RequestTypes.IMPORT_FROM_FILE, key.getPublicInfo())
            );
        } catch (e) {
            // assume the password was wrong
            dispatch(
                setData(RequestTypes.IMPORT_FROM_FILE, { isWrongPassphrase: true })
            );
        }
    }
}

// called when doing backup process, after entering passphrase
export function decryptKey(passphrase) {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.EXPORT) );

        try {
            const key = await keystore.get(getState().request.data.address, passphrase);

            dispatch(
                setData(RequestTypes.EXPORT, { privateKey: key.keyPair.privateKey })
            );
            XRouter.root.goTo('export-key-warning');
        } catch (e) {
            // assume the password was wrong
            dispatch(
                setData(RequestTypes.EXPORT, { isWrongPassphrase: true })
            );
        }
    }
}

// called when doing backup process, after seeing recovery words
export function exportFile() {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.EXPORT) );

        const { encryptedKeyPair } = await keystore.getPlain(getState().request.data.address);

        dispatch(
            setResult(RequestTypes.EXPORT, encryptedKeyPair)
        );
    }
}

// load public key info to data, so we can show it in UI.
export function loadAccountData(requestType) {
    return async (dispatch, getState) => {
        try {
            const key = await keystore.get(getState().request.data.address);
            dispatch(
                setData(requestType, { ...key.getPublicInfo() })
            );
        } catch (e) {
            dispatch(
                setError(requestType, `Account ${address} does not exist`)
            );
        }
    }
}

// called after confirming a transaction sign request (BASIC transaction)
export function signTransaction(passphrase) {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.SIGN_TRANSACTION) );

        const { transaction: { recipient, value, fee, validityStartHeight }, address } = getState().request.data;

        try {
            const key = await keystore.get(address, passphrase);
            const signature = await key.createTransaction(recipient, value, fee, validityStartHeight, 'basic');

            dispatch(
                setResult(RequestTypes.SIGN_TRANSACTION, signature)
            )
        } catch (e) {
            // assume the password was wrong
            dispatch(
                setData(RequestTypes.SIGN_TRANSACTION, { isWrongPassphrase: true })
            );
        }
    }
}

export function rename(passphrase) {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.RENAME) );
        // todo implement
    }
}