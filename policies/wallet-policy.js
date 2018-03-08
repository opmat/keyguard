import BasePolicy from './base-policy.js';
import * as AccountType from '../account-type.js';

export default class WalletPolicy extends BasePolicy {
    constructor(limit) {
        super('wallet');
        this.limit = limit;
    }

    equals(otherPolicy) {
        return super.equals(otherPolicy) && this.limit === otherPolicy.limit;
    }

    allows(method, args) {
        switch (method) {
            case 'createNewAccounts':
            case 'triggerAccountImport':
            case 'persistAccount':
            case 'getAccounts':
                return true;
            case 'sign':
                const { account, recipient, value, fee } = args;
                if (account.type === AccountType.Low) return true;
                return false;
            default:
                throw 'Unhandled method';
        }
    }

    needsUi(method, args) {
        switch (method) {
            case 'createNewAccounts':
            case 'triggerAccountImport':
            case 'persistAccount':
            case 'getAccounts':
                return false;
            case 'sign':
                const { account, recipient, value, fee } = args;
                if (value + fee > this._limit) return true;
                return false;
            default:
                throw 'Unhandled method';
        }
    }
}
