import { PLATFORM } from "aurelia-pal";
import AuthorizeStep from "./core/authorize-step";
import Authorizer from "./elements/authorizer";

/**
 * Configures the plugin.
 * @param {FrameworkConfiguration} aurelia - the aurelia framework configuration
 * @param {*} pluginCallback - the plugin callback
 */

function configure(config) { 
  config.globalResources([
    PLATFORM.moduleName("./elements/authorizer/authorizer")
  ]);
}
export { configure, AuthorizeStep, Authorizer };
