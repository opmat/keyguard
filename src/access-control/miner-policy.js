import BasePolicy from './base-policy.js';

export default class MinerPolicy extends BasePolicy {
    allows(method, args, state) {
        switch (method) {
            case 'list':
            case 'getMinerAccount':
            case 'createWallet':
                return true;
            default:
                throw new Error(`Unhandled method: ${method}`);
        }
    }

    needsUi(method, args, state) {
        switch (method) {
            case 'list':
            case 'getMinerAccount':
                return false;
            case 'createWallet':
                return true;
            default:
                throw new Error(`Unhandled method: ${method}`);
        }
    }
}
