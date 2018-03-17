import BasePolicy from './base-policy.js';
import * as KeyType from '../keys/keytype.js';

export default class SafePolicy extends BasePolicy {
    allows(method, args, state) {
        switch (method) {
            case 'importFromFile':
            case 'importFromWords':
            case 'export':
            case 'get':
            case 'createVolatile':
            case 'create':
                return true;
            case 'sign':
                const [ userFriendlyAddress, recipient, value, fee ] = args;
                const key = state.keys.get(userFriendlyAddress);
                if (key.type === KeyType.high) return true;
                break;
            default:
                throw new Error(`Unhandled method: ${method}`);
        }
    }

    needsUi(method, args, state) {
        switch (method) {
            case 'get':
            case 'createVolatile':
                return false;
            case 'export':
            case 'create':
            case 'importFromFile':
            case 'importFromWords':
            case 'sign':
                return true;
            default:
                throw new Error(`Unhandled method: ${method}`);
        }
    }
}
