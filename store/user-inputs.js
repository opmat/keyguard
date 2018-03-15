export const TypeKeys = {
    SET_PASSWORD: 'userInputs/setPassword',
    SET_LABEL: 'userInputs/setLabel',
    CONFIRM_PERSIST: 'userInputs/confirmPersist',
    CLEAR: 'userInputs/clear',
    DENY: 'userInputs/deny'
};

export function reducer(state, action) {
    const initialState = {
        password: undefined,
        label: undefined,
        confirmed: undefined
    };

    if (state === undefined) {
        return initialState;
    }

    switch (action.type) {
        case TypeKeys.SET_PASSWORD:
            return {
                ...state,
                password: action.password
            };

        case TypeKeys.SET_LABEL:
            return {
                ...state,
                label: action.label
            };

        case TypeKeys.CONFIRM_PERSIST:
            return {
                ...state,
                confirmed: true,
                password: action.password
            };

        case TypeKeys.CLEAR:
            return initialState;

        default:
            return state
    }
}

export function confirmPersist(password, label) {
    return {
        type: TypeKeys.CONFIRM_PERSIST,
        password,
        label
    }
}

export function setPassword(password) {
    return {
        type: TypeKeys.SET_PASSWORD,
        password
    }
}

export function setLabel(label) {
    return {
        type: TypeKeys.SET_LABEL,
        label
    }
}

export function deny() {
    return {
        type: TypeKeys.DENY,
        confirmed: false
    }
}

export function clear() {
    return {
        type: TypeKeys.CLEAR
    }

}
