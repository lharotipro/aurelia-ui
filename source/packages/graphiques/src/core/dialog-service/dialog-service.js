import { inject, Container, CompositionEngine, ViewSlot } from 'aurelia-framework';
import { DialogRenderer } from './dialog-renderer';
import { DialogResult } from './dialog-result';

/**
 * Gère la fonctionnalité de fenêtre modale
 */
@inject(CompositionEngine, Container, DialogRenderer, DialogResult)
export class DialogService {
  /**
   * @param {CompositionEngine} compositionEngine
   * @param {Container} container
   * @param {DialogRenderer} renderer
   * @param {DialogResult} result
   */
  constructor(compositionEngine, container, renderer, result) {
    this._container = container;
    this._compositionEngine = compositionEngine;
    this._renderer = renderer;
    this._result = result;
  }

  /**
   * @param {als.DialogServiceParameter} parameter
   * @returns {Promise<DialogResult>}
   */
  async open({ viewModel, view, model, locked }) {
    const host = this._renderer.createHost();
    /** @type {ext.CompositionContext} */
    const compositionContext = {
      model,
      view,
      viewModel,
      host,
      container: this._container,
      bindingContext: undefined,
      viewResources: undefined,
      viewSlot: new ViewSlot(host, true)
    };

    const viewModelController = await this._compositionEngine.compose(compositionContext);
    viewModelController.attached();
    await this._renderer.open(locked);
    // @ts-ignore
    viewModelController.view.unbind();
    // @ts-ignore
    viewModelController.view.removeNodes();
    return this._result;
  }
}
