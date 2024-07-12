import { inject } from 'aurelia-framework';
import { Connection } from 'aurelia-kis-oidc';
import { RedirectToRoute } from 'aurelia-router'; 
import { Authorizer } from '../authorizer/authorizer';

/**
 * L'énumération des noms de routes par default de l'application 
 */
export const ROUTE = {
  accueil: 'accueil'
};
/**
 * Définit la logique de validation de routage
 */
@inject(Connection, Authorizer)
export default class AuthorizeStep {
  /** @type {ext.Connection} */ connection;

  /**
   * Crée une instance de la classe Authorizer
   * @param {ext.Connection} connection la connection openid
   * @param {ext.Authorizer} authorizer le gestionnaire d'autorisations
   */
  constructor(connection, authorizer) {
    this.connection = connection;
    this._authorizer = authorizer;
  }

  /**
   * @param {ext.NavigationInstruction} navigationInstruction
   * @param {ext.Next} next
   * @returns {Promise<any>}
   */
  run(navigationInstruction, next) {
    const suggestedRoute = navigationInstruction.config.name;
    const alreadyThere = suggestedRoute === ROUTE.accueil;
    if (alreadyThere) return next();
    const isConnected = this.connection.isUserLoggedIn;
    // currently active route - needs connection?
    const canNavigateTo = this._authorizer.shouldIncludeRoute(navigationInstruction.config);
    if (!isConnected || !canNavigateTo) {
      return next.cancel(new RedirectToRoute(ROUTE.accueil));
    }
    return next();
  }
}
