import { RPC, EventClient } from '/libraries/boruca-messaging/src/boruca.js';
import Policy from '../policies/policy.js';
import config from './config.js';

class Demo {
    constructor() {
        this.$network = document.querySelector('#network');
        this.$keystore = document.querySelector('#keystore');
        this.launch();
    }

    async launch() {
        this._keystore = await RPC.Client(this.$keystore.contentWindow, 'KeystoreApi');

        let authorized = false;
        const assumedPolicy = Policy.get('wallet', 1000);
        let grantedPolicy = await this._keystore.getPolicy();
        grantedPolicy = grantedPolicy && Policy.parse(grantedPolicy);

        console.log(`Got policy: ${grantedPolicy}`);

        if (!assumedPolicy.equals(grantedPolicy)) {
            const keystoreWindow = window.open(config.keystoreSrc);
            const keystoreWindowClient = await RPC.Client(keystoreWindow, 'KeystoreApi');

            if (await keystoreWindowClient.authorize(assumedPolicy)) {
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

        const accounts = await this._keystore.getAccounts();

        console.log(`Accounts: ${accounts}`);

    }
}

window.demo = new Demo();
