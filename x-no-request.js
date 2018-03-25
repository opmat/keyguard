import XElement from '/libraries/x-element/x-element.js';

export default class XNoRequest extends XElement {

    html() {
        return `
            Please start at <a href="https://nimiq.com/">nimiq.com</a>
        `;
    }
}
