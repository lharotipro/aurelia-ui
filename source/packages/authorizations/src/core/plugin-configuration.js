/**
 * Defines the configuration for the openid plugin.
 * @category internal
 */
export class PluginConfiguration {
  /**
   * Callback function called when the oidc provider returns an error.
   * @member {function}
   * @callback
   */

  onError;

  /**
   * Callback function called when the oidc provider returns an error.
   * @member {list}
   * @callback
   */
  route;

  /**
   * service Habilitation
   * @member {Object}
   */
  habilitationService;
}
