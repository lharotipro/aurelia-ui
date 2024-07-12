/**
 * Définit le résultat de l'action de fermeture de la fenêtre modale
 */
export class DialogResult {
  /** @type {boolean} */
  wasCancelled = true;

  /** @type {any} */
  output;

  /**
   * @param {any} output
   * @param {boolean} wasCancelled
   */
  update(output, wasCancelled) {
    this.wasCancelled = wasCancelled;
    this.output = output;
  }
}
