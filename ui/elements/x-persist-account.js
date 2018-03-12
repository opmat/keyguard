import XElement from '/libraries/x-element/x-element.js';
import store from '../../store/store.js';
import { bindActionCreators } from '/libraries/redux/src/index.js';
import { add } from '../../store/sample-reducer.js';

export default class XPersistAccount extends XElement {
   onCreate() {
       this.$button = this.$('button');

       const actions = bindActionCreators({add}, store.dispatch);

       store.getState();

       actions.add('foo', 5);

       this.$button.addEventListener('click', () => actions.add('efwf', 1));
   }
}