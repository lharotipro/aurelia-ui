import { bindable, bindingMode } from 'aurelia-framework';

export class LockCustomElement {
  /** @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  locked = false;
}
