import { DOM } from 'aurelia-framework';
import { Toast } from 'bootstrap';

const hideDelay = 2000;

/**
 * Implémente l'affichage de la fenêtre modale
 */
export class ToastRenderer {
  /** @type {HTMLElement} */
  static _rootContainer;
  /** @type {Toast} */
  _bsToast;

  /**
   * Crée ou retourne le conteneur html (div) qui héberge les toasts
   * @returns {HTMLElement}
   */
  createOrGetRootHost() {
    if (!ToastRenderer._rootContainer) {
      // @ts-ignore
      ToastRenderer._rootContainer = DOM.createElement('div');
      ToastRenderer._rootContainer.setAttribute('class', 'toast-container position-fixed bottom-0 end-0 p-3');
      ToastRenderer._rootContainer.setAttribute('style', 'bottom: 45px !important;');
      ToastRenderer._rootContainer.setAttribute('id', 'toastContainer');
      DOM.querySelector('body').append(ToastRenderer._rootContainer);
    }
    return ToastRenderer._rootContainer;
  }

  /**
   * Ouvre le toast
   * @returns {Promise<void>}
   */
  async show(toastHost, delay = hideDelay) {
    this._bsToast = new Toast(toastHost, { delay: delay });
    this._bsToast.show();
    return new Promise((resolve, _reject) => {
      toastHost.addEventListener('hidden.bs.toast', () => {
        toastHost.remove();
        resolve();
      });
    });
  }
}
