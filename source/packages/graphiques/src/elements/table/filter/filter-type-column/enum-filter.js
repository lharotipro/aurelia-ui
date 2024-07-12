import { inject, bindable } from "aurelia-framework";
import { EventAggregator } from 'aurelia-event-aggregator';  
import { generateUniqueId } from "../../../../core/functions";
 
@inject(EventAggregator)
export class EnumFilter {  
  /** @type {any} */ column; 
  /** @type {string} */ uniqueId = generateUniqueId();
  /** @type {string} */ uniqueIdEA;
    /**
   * @type {any}
   * @description représente  l'enum selectionner
   */
    @bindable selectedEnum;
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
 

  // onInputColumnsChange(event)
  selectedEnumChanged(newValue) {
     
      if (!newValue)
      this.column.filterValue = undefined;
      else
      {
        this.column.filterValue = newValue.label;
        this._eventAggregator.publish('filterValueChanged_' +this.uniqueIdEA, {column: this.column.field , value : this.column.filterValue});
      }
       
  }
}
