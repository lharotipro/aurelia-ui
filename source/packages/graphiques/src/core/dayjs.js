import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import utc from 'dayjs/plugin/utc';

export const DATE_LOCALE = 'fr';
export const NUMBER_LOCALE = 'fr-FR';
export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATE_ISO_FORMAT = 'YYYY-MM-DD';

dayjs.locale(DATE_LOCALE);
dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);

export default dayjs;
