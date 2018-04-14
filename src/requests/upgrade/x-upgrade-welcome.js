import XElement from '/libraries/x-element/x-element.js';

export default class XUpgradeWelcome extends XElement {

    html() { return `
        <h1>Upgrade your Account</h1>
        <x-grow></x-grow>
        <div>
            <p class="-left">
                After completion of the following process, your Miner Account will be converted to a
                <a href="https://nimiq.com/faq/safe-account" target="_blank" title="Learn more">Safe Account</a>.
            </p>
            &nbsp;
            <p class="-left">
                For this you will:
                <ul>
                    <li>Authenticate with your PIN</li>
                    <li>Get a backup in form of 24 Recovery Words, which represent your private key</li>
                    <li>Choose a Pass Phrase to encrypt your private key</li>
                </ul>
            </p>
        </div>
        <x-grow></x-grow>
        <button>Let's go</button>
        `;
    }

    listeners() {
        return {
            'click button': _ => this.fire('x-upgrade-welcome-completed')
        }
    }
}
