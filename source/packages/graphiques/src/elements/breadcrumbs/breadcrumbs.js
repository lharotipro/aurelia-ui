import { customElement, inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@inject(Router)
@customElement('breadcrumbs')
export class Breadcrumbs {
  constructor(router) {
    while (router.parent) {
      router = router.parent;
    }
    this.router = router;
  }

  navigate(navigationInstruction) {
    navigationInstruction.router.navigateToRoute(navigationInstruction.config.name);
  }
}
