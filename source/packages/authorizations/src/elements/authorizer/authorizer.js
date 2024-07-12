import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { PureAbility } from "@casl/ability";
import { UserManager } from "oidc-client";
import { isNil } from "../../core/functions";
import { PluginConfiguration } from "../../core/plugin-configuration";

export const authorizationEvent = {
  changed: "habilitationsChanged",
  authorized: "userAuthorized",
};

/** @type {Record<als.AuthorizationStatus, { message: string?,  typeAlerte: als.ThemeColor }>} */
const habilitationMessage = {
  authorized: { message: undefined, typeAlerte: "info" },
  ongoing: { message: "Vérification de vos droits...", typeAlerte: "info" },
  error: {
    message: `Impossible de vérifier vos droits pour l'instant, merci de vous reconnecter ultérieurement.`,
    typeAlerte: "danger",
  },
  unauthorized: {
    message: `Cette application nécessite une autorisation d'accès préalable. Veuillez vous rapprocher de votre correspondant Action Logement.`,
    typeAlerte: "warning",
  },
};

@inject(UserManager, PureAbility, EventAggregator, PluginConfiguration)
export class Authorizer {
  /** @type {als.AuthorizationStatus} */ status;
  /** @type {string} */ message;
  /** @type {als.ThemeColor} */ typeAlerte;

  /**
   * Crée une instance de la classe Authorizer
   * @param {UserManager} userManager
   * @param {PureAbility} ability
   * @param {EventAggregator} eventAggregator
   * @param {PluginConfiguration} pluginconfig
   */
  constructor(userManager, ability, eventAggregator, pluginconfig) {
    this._userManager = userManager;
    this._observeUser((user) => this._synchronizePermissions());
    this._habilitationService = pluginconfig.habilitationService;
    this._ability = ability;
    this._eventAggregator = eventAggregator;
  }

  /**
   * @param {(habilitationManager: PureAbility) => void} callback
   */
  onHabilitationsChanged(callback) {
    return this._eventAggregator.subscribe(
      authorizationEvent.changed,
      callback
    );
  }

  /**
   * @param {(habilitationManager: PureAbility) => void} callback
   */
  onUserAuthorized(callback) {
    return this._eventAggregator.subscribe(
      authorizationEvent.authorized,
      callback
    );
  }

  /**
   * Appelle le callback spécifié à chaque fois que l'état de la connexion utilisateur change.
   * @param {(user: ext.User) => void} userfunc
   * @return {Promise}
   */
  async _observeUser(userfunc) {
    this._userManager.events.addUserLoaded((user) => userfunc(user));
    this._userManager.events.addUserUnloaded((user) => userfunc(user));
    return this._userManager.getUser().then((user) => userfunc(user));
  }

  /**
   * Récupère les habilitations de l'utilisateur et synchronise les permissions
   * @returns {Promise<als.Habilitation[]>}
   */
  async _synchronizePermissions() {
    const user = await this._userManager.getUser();
    if (isNil(user)) return this._synchronizeUiPermissions([], "unauthorized");
    this._synchronizeUiPermissions([], "ongoing");
    return await this._habilitationService
      .getHabilitations()
      .then((habilitations) => this._synchronizeUiPermissions(habilitations))
      .catch((error) => {
        return this._synchronizeUiPermissions([], "error");
      });
  }

  /**
   * Synchronise les permissions dans l'IHM par rapport aux habilitations de l'utilisateur
   * @param {als.Habilitation[]} habilitations
   * @param {als.AuthorizationStatus} [status]
   * @returns {als.Habilitation[]}
   */
  _synchronizeUiPermissions(habilitations, status) {
    this.status =
      status ?? (habilitations.length === 0 ? "unauthorized" : "authorized");
    this.message = habilitationMessage[this.status].message;
    this.typeAlerte = habilitationMessage[this.status].typeAlerte;
    this._ability.update(habilitations);
    this._eventAggregator.publish(authorizationEvent.changed, this._ability);
    if (this.status === "authorized")
      this._eventAggregator.publish(
        authorizationEvent.authorized,
        this._ability
      );
    return habilitations;
  }

  /**
   * Vérifie si la route doit être incluse par rapport aux habilitations de l'utilisateur
   * @param {ext.RouteConfig} route - The route configuration.
   * @param {ext.PureAbility} habilitationManager - The permissions object.
   * @returns {boolean} - True if the route should be included, false otherwise.
   */
  shouldIncludeRoute(route, habilitationManager = this._ability) {
    if (!route.settings?.requiredPermissions) return true;
    /** @type {als.ProtectedRoutedConfiguration} */
    const { requiredPermissions, permissionOperator } = route.settings;
    return this._checkPermission(
      requiredPermissions,
      permissionOperator,
      habilitationManager
    );
  }

  /**
   * Vérifie si la permission requise concorde avec les habilitations de l'utilisateur.
   * @param {als.Permission[]} permissions - The permission(s) to check.
   * @param {'&&' | '||'} operator - The permission operator.
   * @param {ext.PureAbility} habilitationManager - The permissions object.
   * @returns {boolean} - True if the permission is satisfied, false otherwise.
   */
  _checkPermission(permissions, operator = "||", habilitationManager) {
    return operator === "||"
      ? permissions.some(({ action, resource }) =>
          habilitationManager.can(action, resource)
        )
      : permissions.every(({ action, resource }) =>
          habilitationManager.can(action, resource)
        );
  }
}
