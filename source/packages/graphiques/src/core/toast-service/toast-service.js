import { inject, Container, CompositionEngine, ViewSlot, NewInstance, PLATFORM } from 'aurelia-framework';
import { ToastRenderer } from './toast-renderer';
import { toastType } from './toast-type';

/**
 * Gère la fonctionnalité de fenêtre modale
 */
@inject(CompositionEngine, Container, NewInstance.of(ToastRenderer))
export class ToastService {
  /**
   * @param {CompositionEngine} compositionEngine
   * @param {Container} container
   * @param {ToastRenderer} renderer
   */
  constructor(compositionEngine, container, renderer) {
    this._container = container;
    this._compositionEngine = compositionEngine;
    this._renderer = renderer;
  }

  /**
   * @param {string} message
   */
  async _show(message, type, delay = 0) {
    const host = this._renderer.createOrGetRootHost();
    /** @type {ext.CompositionContext} */
    const compositionContext = {
      viewModel: { message, type },
      view: PLATFORM.moduleName('core/toast-service/toast.html'), 
      // view: PLATFORM.moduleName('node_modules/@als/aurelia-ui-test/dist/native-modules/elements/toast/toast.html'),
      container: this._container,
      bindingContext: undefined,
      viewResources: undefined,
      viewSlot: new ViewSlot(host, true)
    };
    /** @type {ext.Controller} */
    // @ts-ignore
    const viewModelController = await this._compositionEngine.compose(compositionContext);
    // @ts-ignore
    const toastDiv = viewModelController.view.firstChild.nextSibling;
    delay === 0 ? await this._renderer.show(toastDiv) : await this._renderer.show(toastDiv, delay);
    viewModelController.view.unbind();
    viewModelController.view.removeNodes();
  }

  async info(message, delay = 0) {
    await this._show(message, toastType.info, delay);
  }

  async error(message, delay = 0) {
    await this._show(message, toastType.error, delay);
  }

  async warning(message, delay = 0) {
    await this._show(message, toastType.warning, delay);
  }

  async success(message, delay = 0) {
    await this._show(message, toastType.success, delay);
  }
}
