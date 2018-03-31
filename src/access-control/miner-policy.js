import BasePolicy from './base-policy.js';

export default class MinerPolicy extends BasePolicy {
    allows(method, args, state) {
        switch (method) {
            case 'list':
                return true;
            default:
                throw new Error(`Unhandled method: ${method}`);
        }
    }

    needsUi(method, args, state) {
        switch (method) {
            case 'list':
                return false;
            default:
                throw new Error(`Unhandled method: ${method}`);
        }
    }
}
