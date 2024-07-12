import { isNilOrEmpty } from '../core/functions';
import dayjs from '../core/dayjs';

export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATE_ISO_FORMAT = 'YYYY-MM-DD';
export class DateFormatValueConverter {
  /**
   * Convertit la valeur ISO 8601 fournie en string pour l'affichage au format spécifié
   * @param {string} value
   * @param {string} format
   * @returns {string | undefined}
   */
  toView(value, format = DATE_FORMAT) {
    if (isNilOrEmpty(value)) return;
    return dayjs(value.slice(0, 10), DATE_ISO_FORMAT, true).isValid()
      ? dayjs(value.slice(0, 10), DATE_ISO_FORMAT, true).format(format)
      : '';
  }
}
