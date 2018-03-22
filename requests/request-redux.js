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

export const SATOSHIS = 1e5;

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


// called when doing backup process, after entering passphrase
export function decryptKey(passphrase) {
    return async (dispatch, getState) => {
        dispatch( setExecuting(RequestTypes.EXPORT) );

        try {
            const key = await keystore.get(getState().request.data.address, passphrase);

            dispatch(
                setData(RequestTypes.EXPORT, { privateKey: key.keyPair.privateKey.toHex() })
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
            setResult(RequestTypes.EXPORT, Nimiq.BufferUtils.toBase64(encryptedKeyPair))
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


