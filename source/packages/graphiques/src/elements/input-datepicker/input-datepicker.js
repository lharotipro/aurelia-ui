/* eslint-disable unicorn/no-null */
import { DOM, inject, bindable, bindingMode, TaskQueue } from 'aurelia-framework';
import { Datepicker } from 'vanillajs-datepicker';
   
import locale from 'vanillajs-datepicker/js/i18n/locales/fr.js';

import { generateUniqueId } from '../../core/functions';

@inject(DOM.Element, TaskQueue)
export class InputDatepicker {
  /** @type {string} date in iso string format */
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  date;

  /** @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  placeholder;

  /** @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  disabled = false;

  /** @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  readonly = false;

  /** @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  autohide = true;

  /** @type {number[]} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  disabledDays = [];

  /** @type {string[]} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  disabledDates = [];

  /** @type {string} */ uniqueId = generateUniqueId();
  /** @type {HTMLTemplateElement} */ _container;
  /** @type {HTMLInputElement} */ _input;
  /** @type {string} */ value;

  /**
   * @param {HTMLTemplateElement} element
   * @param {TaskQueue} taskqueue
   */
  constructor(element, taskqueue) {
    this._container = element;
    this._taskqueue = taskqueue;
    locale.fr.daysMin = ['di', 'lu', 'ma', 'me', 'je', 've', 'sa'];
    Object.assign(Datepicker.locales, locale);
  }

  /**
   * Code déclenché quand une date est sélectionnée dans le composant
   * @type {(event: CustomEvent) => void}
   */
  changeDateListener = event => {
    this._setDate(/** @type {CustomEvent} */ (event));
  };

  _lock;

  /**
   * Code de construction du composant au chargement du DOM
   */
  attached() {
    // création du composant datepicker
    this._input = this._container.querySelector(`input[name="dp_${this.uniqueId}"]`);
    if (!this._input) throw new Error('Template html datepicker invalide !');
    this._input.addEventListener('changeDate', this.changeDateListener);
    this._datepicker = new Datepicker(this._input, {
      buttonClass: 'btn btn-secondary',
      updateOnBlur: true,
      autohide: this.autohide,
      language: 'fr',
      todayHighlight: true,
      daysOfWeekDisabled: this.disabledDays,
      // @ts-ignore
      datesDisabled: this.disabledDates?.map(d => new Date(d))
    });
    // si une date est déjà bindée on définit la date du composant
    if (!this.date) return;
    this._lock = true;
    this._datepicker.setDate(new Date(this.date));
    this._lock = false;
  }

  /**
   * Code déclenché au déchargement du DOM
   */
  detached() {
    this._input?.removeEventListener('changeDate', this.changeDateListener);
    this._datepicker?.destroy();
  }

  /**
   * Code déclenché quand l'attribut 'date' du composant est databindé
   * @param {string} date ISO string
   */
  dateChanged(date) {
    if (this._lock) return;
    this._taskqueue.queueMicroTask(() => {
      this._datepicker?.setDate(new Date(date));
    });
  }

  /**
   * Code déclenché quand l'attribut 'disabledDates' du composant est databindé
   * @param {string[]} disabledDates au format ISO string
   */
  disabledDatesChanged(disabledDates) {
    if (!this._datepicker) return;
    const datesDisabled = disabledDates?.map(d => new Date(d));
    this._datepicker.setOptions({ datesDisabled });
  }

  /**
   * Mise à jour de l'attribut 'date' du composant
   * @param {CustomEvent} event
   */
  _setDate(event) {
    /** @type {{date: Date}} */
    const { date } = event.detail;
    this.date = date.toISOString();
  }
}
