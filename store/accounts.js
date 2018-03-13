export const TypeKeys = {
    ADD: 'accounts/add',
    CLEAR: 'accounts/clear',
    PERSIST: 'accounts/persist'
};

export function reducer(state, action) {
    if (state === undefined) {
        return {
            volatileAccounts: new Map(),
            toBePersisted: null
        }
    }

    switch (action.type) {
        case TypeKeys.ADD:
            return {
                ...state,
                volatileAccounts: new Map(state.volatileAccounts).set(action.account.userFriendlyAddress, action.account)
            };

        case TypeKeys.CLEAR:
            return {
                ...state,
                volatileAccounts: new Map()
            };

        case TypeKeys.PERSIST:
            return {
                ...state,
                toBePersisted: action.accountNumber
            };

        default:
            return state
    }
}

export function addVolatile(account) {
    return {
        type: TypeKeys.ADD,
        account
    }
}

export function clearVolatile() {
    return {
        type: TypeKeys.CLEAR
    }
}

export function persist(accountNumber) {
    return {
        type: TypeKeys.PERSIST,
        accountNumber
    }
}
