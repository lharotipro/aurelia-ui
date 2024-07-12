import { inject, customElement } from "aurelia-framework";
import { EventAggregator } from 'aurelia-event-aggregator';  
import { generateUniqueId } from "../../../../core/functions";
 
@inject(EventAggregator)
export class LinkActionFilter {  
  /** @type {any} */ column; 
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

  onInputChange(){
    this._eventAggregator.publish('filterValueChanged_' +this.uniqueIdEA, {column: this.column.field , value : this.column.filterValue});
  }
}
