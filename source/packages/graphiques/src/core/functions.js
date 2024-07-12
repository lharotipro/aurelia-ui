const maxCommonLength = 19;

/**
 * Pause l'exécution pendant le délai spécifié  en millisecondes.
 * @param {number} delay - délai en millisecondes
 * @return {Promise} La promise résolue à l'issue du délai
 */
export const wait = delay => new Promise(resolve => setTimeout(resolve, delay));

/**
 * Est-ce que le paramètre spécifié est null ou undefined ?
 * @param {*} value - l'objet à tester
 * @return {boolean} true si l'objet est null ou undefined, false sinon.
 */
export const isNil = value => value === undefined || value === null;

/**
 * Est-ce que le paramètre spécifié est null, undefined ou vide ?
 * @param {*} value - l'objet à tester
 * @return {boolean} true si l'objet est null ou undefined ou vide, false sinon.
 */
export const isNilOrEmpty = value => value === undefined || value === null || value.length === 0 || Object.getOwnPropertyNames(value).length === 0;

/**
 * Génère un identifiant unique
 * @return {string} true si l'objet est null ou undefined ou vide, false sinon.
 */
export const generateUniqueId = () => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).slice(2);
  return timestamp + randomPart;
};

/**
 * Vérifie si un objet est une string
 * @param {any} value
 * @returns {boolean}
 */
export const isString = value => typeof value === 'string' || value instanceof String;

/**
 * Vérifie si un objet est une date
 * @param {any} value
 * @returns {boolean}
 */
export const isDate = value => value instanceof Date;

/**
 * Vérifie si une string est une date au format ISO
 * @param {string} value
 * @returns {boolean}
 */
export const isValidDateISOString = value => {
  if (!isString(value)) return false;
  const dateParsed = new Date(Date.parse(value));
  return (
    // @ts-ignore
    !isNaN(dateParsed) &&
    dateParsed.toISOString().slice(0, maxCommonLength) === value.slice(0, maxCommonLength)
  );
};
