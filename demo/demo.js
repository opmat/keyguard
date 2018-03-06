import { RPC, EventClient } from '/libraries/boruca-messaging/src/boruca.js';
import Policy from '../policy.js';
import config from './config.js';

class Vault {
    constructor() {
        this.$network = document.querySelector('#network');
        this.$keystore = document.querySelector('#keystore');
        this.launch();
    }

    async launch() {
        this._keystore = await RPC.Client(this.$keystore.contentWindow, 'KeystoreApi');

        let authorized = false;
        const assumedPolicy = Policy.get('full-access');
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

        const addresses = await this._keystore.getAddresses();

        console.log(`Addresses: ${addresses}`);

    }
}

window.vault = new Vault();
