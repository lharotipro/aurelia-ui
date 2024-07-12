import { inject } from 'aurelia-framework';
import { DialogRenderer } from './dialog-renderer';
import { DialogResult } from './dialog-result';

/**
 * Pilote le comportement de fermeture de la fenêtre modale
 */
@inject(DialogRenderer, DialogResult)
export class DialogController {
  /**
   * @param {DialogRenderer} renderer
   * @param {DialogResult} result
   */
  constructor(renderer, result) {
    this._renderer = renderer;
    this._result = result;
  }

  /**
   * Valide et ferme la fenêtre modale
   * @param {unknown | undefined} output
   */
  ok(output) {
    this._result.update(output, false);
    this._renderer.hide();
  }

  /**
   * Invalide et ferme la fenêtre modale
   * @param {unknown | undefined} output
   */
  cancel(output) {
    this._result.update(output, true);
    this._renderer.hide();
  }
}
