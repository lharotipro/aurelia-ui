import { DOM } from 'aurelia-framework';
import { Modal } from 'bootstrap';

/**
 * Implémente l'affichage de la fenêtre modale
 */
export class DialogRenderer {
  /** @type {HTMLDivElement} */
  _hostDiv;

  /**
   * Créer le conteneur html (div) de la fenêtre modale
   * @returns {HTMLDivElement}
   */
  createHost() {
    // @ts-ignore
    this._hostDiv = DOM.createElement('div');
    this._hostDiv.setAttribute('class', 'modal fade');
    return this._hostDiv;
  }

  /**
   * Ouvre la fenêtre modale
   * @param {boolean} locked
   * @returns {Promise<void>}
   */
  async open(locked = false) {
    this._modal = new Modal(this._hostDiv, { backdrop: locked ? 'static' : true });
    this._modal.show();
    return new Promise((resolve, _reject) => {
      this._hostDiv.addEventListener('hidden.bs.modal', () => {
        this.destroy();
        resolve();
      });
    });
  }

  /**
   *  Masque la fenêtre modale
   */
  hide() {
    this._modal.hide();
  }

  /**
   * Détruit la fenêtre modale et les ressources associées
   */
  destroy() {
    this._modal.dispose();
    this._hostDiv.remove();
  }
}
