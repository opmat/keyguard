import BasePolicy from './base-policy.js';
import * as Keytype from '../keys/keytype.js';

export default class SafePolicy extends BasePolicy {
    allows(method, args, state) {
        switch (method) {
            case 'importFromFile':
            case 'importFromWords':
            case 'export':
            case 'list':
            case 'createVolatile':
            case 'create':
                return true;
            case 'sign':
                // for now, assume there are only keys we are able to use in safe app
                return true;
                /*const [ userFriendlyAddress, recipient, value, fee ] = args;
                const key = (state.keys || state.accounts.entries).get(userFriendlyAddress);
                if (key.type === Keytype.HIGH) return true; */
            default:
                throw new Error(`Unhandled method: ${method}`);
        }
    }

    needsUi(method, args, state) {
        switch (method) {
            case 'list':
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
