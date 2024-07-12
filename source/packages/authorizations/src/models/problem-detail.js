import { fromObject } from "../core/decorators";

/**
 * Erreur d'API au format RFC 9457
 */
@fromObject
export class ProblemDetail {
  /** @type {string} */ type;
  /** @type {string} */ title;
  /** @type {string} */ detail;
  /** @type {number} */ status;
  /** @type {string} */ instance;
  /** @type {any} */ error;
  /** @type {any[]} */ errors;
}
