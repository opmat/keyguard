import XElement from '/libraries/x-element/x-element.js';
import XAuthenticateBackup from '/libraries/keyguard/src/common-elements/x-authenticate-backup.js';
import XShowWords from '/libraries/keyguard/src/common-elements/x-show-words.js';
import XRouter from '/secure-elements/x-router/x-router.js';
import XPrivacyAgent from '/secure-elements/x-privacy-agent/x-privacy-agent.js';
import MixinRedux from '/secure-elements/mixin-redux/mixin-redux.js';
import { RequestTypes, setData, setResult } from '../request-redux.js';
import { backupWords } from './actions.js';

export default class XBackupWords extends MixinRedux(XElement) {

    html() { return `
        <section x-route="">
            <h1>Backup your Account</h1>
            <x-grow></x-grow>
            <x-privacy-agent></x-privacy-agent>
        </section>
        <x-authenticate-backup x-route="authenticate"></x-authenticate-backup>
        <x-show-words x-route="words"></x-show-words>
        `;
    }

    children() {
        return [ XAuthenticateBackup, XPrivacyAgent, XShowWords ];
    }

    static get actions() {
        return { setData, setResult, backupWords };
    }

    listeners() {
        return {
            'x-authenticate-submitted': passphrase => this.actions.backupWords(passphrase),
            'x-surrounding-checked': async () => (await XRouter.instance).goTo(this, 'authenticate'),
            'x-show-words': () => this.actions.setResult(RequestTypes.BACKUP_WORDS, true)
        };
    }
}
