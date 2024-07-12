import { inject, DOM } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { generateUniqueId } from "../../../../core/functions";
import Datepicker from 'vanillajs-datepicker/Datepicker'; 
@inject(EventAggregator)
export class DateFilter {
  /** @type {any} */ 
  column;
  /** @type {string} */ uniqueId = generateUniqueId();
  /** @type {string} */ uniqueIdEA;
  /**
   * @param {EventAggregator} eventAggregator
   */
  constructor(eventAggregator) {
    this._eventAggregator = eventAggregator;
  }

  
  activate(model) {
    this.column = model.column; 
    this.uniqueIdEA = model.uniqueId; 
  }

  attached() {
    const elem = DOM.querySelector('input[name="datepicker-input"]');
    const datepicker = new Datepicker(elem, {
      // Example options
      autohide: true,
      buttonClass: "btn",
      format: "dd/mm/yyyy",
    });

    elem.addEventListener("changeDate", (e) => { 
      // Extract day, month, and year components
      const day = String(e.detail.date.getDate()).padStart(2, "0");
      const month = String(e.detail.date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const year = e.detail.date.getFullYear();

      // Format the date as "DD/MM/YYYY"
      const formattedDate = `${day}/${month}/${year}`; 
      

      this._eventAggregator.publish("filterValueChanged_" + this.uniqueIdEA, {
        column: this.column.field,
        value: formattedDate
      });
    });
    
  }

  onDateFilterChange() {
    this._eventAggregator.publish("filterValueChanged_" + this.uniqueIdEA, {
      column: this.column.field,
      value: this.column.filterValue,
    });
  }
}
