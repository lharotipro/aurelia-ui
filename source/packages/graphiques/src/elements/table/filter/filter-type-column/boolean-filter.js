import { inject , bindable} from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { generateUniqueId } from "../../../../core/functions"; 

@inject(EventAggregator)
export class BooleanFilter {
  /** @type {any} */
  column;
  /** @type {string} */
  uniqueId = generateUniqueId();
  @bindable isChecked = true;

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

  onCheckBoxChange() {

    this.isChecked = !this.isChecked;  
    this.column.filterValue = this.value =   this.isChecked ;  

    this._eventAggregator.publish('filterValueChanged_' + this.uniqueIdEA, {
      column: this.column.field,
      value: this.isChecked
    }); 
  }
}
