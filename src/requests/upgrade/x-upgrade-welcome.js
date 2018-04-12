import XElement from '/libraries/x-element/x-element.js';

export default class XUpgradeWelcome extends XElement {

    html() { return `
        <h1>Upgrade your Account</h1>
        <x-grow x-grow="0.5"></x-grow>
        <div>
            After completion of the following process, your miner account will be converted to a
            <a href="https://nimiq.com/faq/safe-account" target="_blank" title="Learn more">safe account</a>.
            You will
            <ul>
                <li>Authenticate with your PIN</li>
                <li>Get a backup in form of 24 recovery words, which represent your private key</li>
                <li>Choose a Pass Phrase to encrypt your private key</li>
            </ul>
        </div>
        <x-grow x-grow="0.5"></x-grow>
        <button>Let's go</button>
        <x-grow></x-grow>
        `;
    }

    listeners() {
        return {
            'click button': _ => this.fire('x-upgrade-welcome-completed')
        }
    }
}
