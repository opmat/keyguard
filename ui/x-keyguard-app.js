import XElement from '/libraries/x-element/x-element.js';
import XPersistWrapper from './elements/x-persist-wrapper.js';
import XRouter from '/elements/x-router/x-router.js';

export default class XKeyguardApp extends XElement {

    html() {
        return `
        <x-router>
          <x-persist-wrapper x-route="persist">
          </x-persist-wrapper>
          <main x-route="/">
            <x-loading-animation></x-loading-animation>
            <h2>Calling keyguard</h2>
          </main>
        </x-router>
        `;
    }

    children() {
        return [ XRouter, XPersistWrapper ];
    }
}
