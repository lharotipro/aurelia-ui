import { bindable, bindingMode } from 'aurelia-framework';

export class LoadingIndicatorCustomElement {
  /** @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  loading = false;
}
