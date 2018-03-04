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

        const assumedPolicy = new Policy();

        let authorized = false;

        const policy = await this._keystore.getPolicy();
        console.log(`Got policy: ${policy}`);

        if (policy !== assumedPolicy) {
            if (await this._keystore.authorize(policy)) {
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

    _onConsensusEstablished() {
        console.log('Consensus established');
    }

    _onBalanceChanged(obj) {
        console.log('Balance changed:', obj.address, obj.balance);
    }

    getBalance(address) {
        return this._network.getBalance(address);
    }

    subscribeAddress(address) {
        return this._network.subscribeAddress(address);
    }

    subscribeAndGetBalance(address) {
        return this._network.subscribeAndGetBalance(address);
    }

    relayTransaction(obj) {
        return this._network.relayTransaction(obj);
    }
}

window.vault = new Vault();
