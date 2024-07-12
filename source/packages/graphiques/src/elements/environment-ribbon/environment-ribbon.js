import { bindable, bindingMode, computedFrom } from 'aurelia-framework';

export class EnvironmentRibbonCustomElement {
  /** @type {als.EnvironmentDescriptor} */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  environment;

  /** @type {als.RibbonPosition} */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  position = 'top-left';

  @computedFrom('position')
  get cssPosition() {
    return this.position
      .split('-')
      .map(part => `er-${part}`)
      .join(' ');
  }

  @computedFrom('environment')
  get cssColor() {
    return `er-${this.environment.type.toLowerCase()}`;
  }
}
