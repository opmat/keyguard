import BasePolicy from './base-policy.js';
import * as AccountType from '../accounts/account-type.js';

export default class SafePolicy extends BasePolicy {
    allows(method, args, state) {
        switch (method) {
            case 'createNewAccounts':
            case 'triggerAccountImport':
            case 'getAccounts':
            case 'createVolatileAccounts':
            case 'persistAccount':
                return true;
            case 'sign':
                const { accountNumber, recipient, value, fee } = args;
                const account = state.accounts.get(accountNumber);
                if (account.type === AccountType.High) return true;
                break;
            default:
                throw 'Unhandled method';
        }
    }

    needsUi(method, args, state) {
        switch (method) {
            case 'createNewAccounts':
            case 'getAccounts':
            case 'createVolatileAccounts':
                return false;
            case 'persistAccount':
            case 'triggerAccountImport':
            case 'sign':
                return true;
            default:
                throw 'Unhandled method';
        }
    }
}
