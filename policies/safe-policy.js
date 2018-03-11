import BasePolicy from './base-policy.js';
import * as AccountType from '../account-type.js';

export default class SafePolicy extends BasePolicy {
    allows(method, args) {
        switch (method) {
            case 'createNewAccounts':
            case 'triggerAccountImport':
            case 'persistAccount':
            case 'getAccounts':
            case 'createVolatileAccounts':
                return true;
            case 'sign':
                // TODO how to get account type here?
                const { account, recipient, value, fee } = args;
                if (account.type === AccountType.High) return true;
                break;
            default:
                throw 'Unhandled method';
        }
    }

    needsUi(method, args) {
        // todo persistAccount => true (debugging now)
        switch (method) {
            case 'createNewAccounts':
            case 'getAccounts':
            case 'createVolatileAccounts':
            case 'persistAccount':
                return false;
            case 'triggerAccountImport':
            case 'sign':
                return true;
            default:
                throw 'Unhandled method';
        }
    }
}
