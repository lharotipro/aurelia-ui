import { fromObject } from '../core/decorators';

/**
 * Habilitation accordée à l'utilisateur
 */
@fromObject
export class Habilitation {
  /** @type {string} */ action;
  /** @type {string} */ subject;
}
