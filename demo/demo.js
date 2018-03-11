import { RPC } from '/libraries/boruca-messaging/src/boruca.js';
import SafePolicy from '../policies/safe-policy.js';
import Policy from '../policy.js';
import config from './config.js';
import * as AccountType from '../accounts/account-type.js';

class Demo {
    constructor() {
        this.$keyguard = document.querySelector('#keyguard');
        this.$keyguard.src = config.keyguardSrc;
        this.launch();
    }

    async launch() {
        this._keyguard = await RPC.Client(this.$keyguard.contentWindow, 'KeyguardApi', (new URL(config.keyguardSrc)).origin);

        let authorized = false;
        const assumedPolicy = new SafePolicy;
        let grantedPolicy = await this._keyguard.getPolicy();
        grantedPolicy = grantedPolicy && Policy.parse(grantedPolicy);

        console.log(`Got policy: ${grantedPolicy}`);

        if (!assumedPolicy.equals(grantedPolicy)) {
            const keyguardWindow = window.open(config.keyguardSrc);
            const keyguardWindowClient = await RPC.Client(keyguardWindow, 'KeyguardApi', (new URL(config.keyguardSrc)).origin);

            if (await keyguardWindowClient.authorize(assumedPolicy)) {
                authorized = true;
                console.log('Authorization successfull');
            } else {
                console.log('Authorization declined');
            }
        } else {
            authorized = true;
        }

        if (!authorized){
            return;
        }

        console.log('Now we are authorized');

        let accounts = await this._keyguard.getAccounts();

        console.log(`Accounts: ${accounts}`);

        const volatileAccounts = await this._keyguard.createVolatileAccounts(2);

        console.log(`Volatile accounts: ${volatileAccounts}`);

        await this._keyguard.persistAccount(volatileAccounts[0], AccountType.Low);

        accounts = await this._keyguard.getAccounts();

        console.log(`Accounts after persisting first volatile account: ${accounts}`);
    }
}

window.demo = new Demo();
