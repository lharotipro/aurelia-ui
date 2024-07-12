import { errorMessage } from "./constant";
import { handleError, tryExtractMeaningfulMessage } from "./logger";
import { ProblemDetail } from "../problem-detail";
import environment from "../../dev-app/environment";

/**
 * Construit un message html destiné à l'utilisateur final à partir du ProblemDetail générique spécifié
 * @type { (problem: ProblemDetail) => string }
 */
const buildApiDebugErrorMessage = (problem) =>
  `<dl><dt>${problem.title}</dt>${
    problem.status && problem.status !== -1
      ? "<dd>Code http <strong>" + problem.status + "</strong></dd>"
      : ""
  }<dd>${tryExtractMeaningfulMessage(problem)}</dd></dl>`;

/**
 * Construit un message destiné à l'utilisateur final à partir du ProblemDetail de type BusinessError
 * @type { (problem: ProblemDetail) => string }
 */
// eslint-disable-next-line no-control-regex
const buildApiBusinessUserMessage = (problem) =>
  problem.detail.replace(new RegExp("\n"), "<br>");

/**
 * Construit un message destiné à l'utilisateur final à partir du ProblemDetail de type ValidationError
 * @type { (problem: ProblemDetail) => string }
 */
const buildApiValidationUserMessage = (problem) =>
  problem.errors.map((error) => error.errorMessage).join("<br>");

/**
 * Implémente un interceptor qui notifie l'utilisateur d'un problème de communication.
 */
export class ErrorInterceptor {
  /**
   * Construit un message destiné à l'utilisateur final en fonction de l'environnement (debug ou non)
   * @param {ProblemDetail} problem
   * @returns {string}
   */
  buildApiUserErrorMessage(problem) {
    let userMessage = environment.debug
      ? buildApiDebugErrorMessage(problem)
      : errorMessage.api.default;
    try {
      if (problem.status === 400)
        userMessage = buildApiValidationUserMessage(problem);
      if (problem.status === 403) userMessage = errorMessage.api.unauthorized;
      if (problem.status === 406)
        userMessage = buildApiBusinessUserMessage(problem);
      if (problem.status === 500 && !environment.debug)
        userMessage = errorMessage.api.server;
      if (problem.status === -1) userMessage = errorMessage.api.noNetwork;
    } catch {
      /* empty */
    }
    return userMessage;
  }

  /**
   * Construit un object ProblemDetail à partir d'une erreur d'API
   * @param {unknown} error
   * @returns {Promise<ProblemDetail>}
   */
  async buildProblemDetail(error) {
    if (error instanceof Response) {
      let text = "";
      try {
        text = await error.text();
        const errorObject = JSON.parse(text);
        return "title" in errorObject && "status" in errorObject
          ? // @ts-ignore
            ProblemDetail.fromObject(errorObject)
          : // @ts-ignore
            ProblemDetail.fromObject({
              title: `Erreur appel api (JSON non RFC 9457)`,
              status: error.status,
              error: errorObject,
            });
      } catch {
        // @ts-ignore
        return ProblemDetail.fromObject({
          title: `Erreur appel api (réponse non JSON)`,
          status: error.status,
          error: text,
        });
      }
    }
    // @ts-ignore
    return ProblemDetail.fromObject({
      title: "Api http non accessible ou bloquée par CORS",
      status: -1,
      error,
    });
  }

  /**
   * Gère l'affichage des erreurs de communication http
   * @param {unknown} error
   */
  async handleApiError(error) {
    // construit un object ProblemDetail à partir des erreurs http si jamais l'api n'en retourne pas un nativement
    const problem = await this.buildProblemDetail(error);
    // définit le message à afficher à l'utilisateur final (si en mode debug ou non)
    const userMessage = this.buildApiUserErrorMessage(problem);
    handleError("[API ERROR]", problem, userMessage);
  }

  // /**
  //  * Intercepts and handles the response.
  //  * @param {Response} response - the intercepted response
  //  * @returns {Promise<Response>}
  //  */
  // async response(response) {
  //   if (!response.ok && response.status !== 401 && response.status !== 404) {
  //     this.handleApiError(response);
  //     throw response;
  //   }
  //   return response;
  // }

  /**
   * Intercepts and handles the request error.
   * @param {Error} error - the intercepted requestError
   * @returns {Promise<Request>}
   */
  async requestError(error) {
    this.handleApiError(error);
    throw error;
  }

  /**
   * Intercepts and handles the response error.
   * @param {Error & Response} error - the intercepted responseError
   * @returns {Promise<Response>}
   */
  async responseError(error) {
    if (error.status !== 401 && error.status !== 404) {
      this.handleApiError(error);
    }
    throw error;
  }
}
