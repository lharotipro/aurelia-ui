import { inject, bindable, computedFrom } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { generateUniqueId } from "../../../core/functions";
import { DropdownManager } from "../../../core/dropdown-manager";
import { Dropdown } from "bootstrap";  
import { ColumnTypes, FiltreType } from "../../../core/constant";
@inject(EventAggregator, DropdownManager)
export class FilterHandler {
  /**
   * @type {GenericColumn}
   * @description représente  la colonne à filtrer
   */
  column;
  /**
   * @type {GenericColumn}
   * @description représente  la liste des colonnes à filtrer
   */
  columns;
  /**
   * @type {GenericColumn}
   * @description représente  la colonne
   */
  @bindable selectedColumn;

  typeFiltre = FiltreType.table;
  isDropdownOpen = false;
  uniqueId = generateUniqueId();
  dropdownButtonElement;

  constructor(eventAggregator, dropdownManager) {
    this._eventAggregator = eventAggregator;
    this._dropdownManager = dropdownManager;
  }

  activate(model) {
    this.setupEventListeners();
    this.column = model.data;
    this.typeFiltre = model.type;
    if (this.typeFiltre == "column") this.column = model.data;
    else if (this.typeFiltre == "table") this.columns = model.data;
    else
      console.warn(
        "Generic table : Possible values for filter type proprety : column or table."
      );
  }

  attached() {
    this._dropdownManager.register(this);
    this.dropdownElement = new Dropdown(this.dropdownButtonElement);
    this.dropdownButtonElement.addEventListener("show.bs.dropdown", (event) => {
      this.isDropdownOpen = false;
    });
  }

  detached() {
    this.disposeEventListeners();
    this._dropdownManager.unregister(this);
  }

  applyFilter(data) {
    for (const dropdown of this._dropdownManager.dropdowns) {
      let column = dropdown.column;
      let uniqueId = dropdown.uniqueId;
      if (this.uniqueId != uniqueId) {
        column.filterValue = column.filteredColumn = "";
        this._eventAggregator.publish("filterValueChanged_" + uniqueId, column);
      }
    }

    this._eventAggregator.publish("filterApplied", data);
    this.closeDropdown();
  }
  clearFilter() {
    if (
      this.selectedColumn == undefined &&
      this.column.filterValue == "" &&
      this.column.filteredColumn == ""
    )
      return;

    this.selectedColumn = undefined;
    this.column.filterValue = this.column.filteredColumn = "";
    this._eventAggregator.publish(
      "filterValueChanged_" + this.uniqueId,
      this.column
    );
    this._eventAggregator.publish("filterApplied", undefined);
  }

  //#region Dropdowns functions

  toggleDropdown() {
    if (!this.isDropdownOpen) {
      this._dropdownManager.closeAll(this);
    }
    this.isDropdownOpen = !this.isDropdownOpen;
    this.updateDropdownState();
  }

  closeDropdown() {
    this.isDropdownOpen = false;
    this.updateDropdownState();
  }

  updateDropdownState() {
    if (this.isDropdownOpen) {
      this.dropdownElement.show();
    } else {
      this.dropdownElement.hide();
    }
  }
  //#endregion

  //#region Listeners
  setupEventListeners() {
    this.subscription = this._eventAggregator.subscribe(
      "filterValueChanged_" + this.uniqueId,
      (data) => {
        this.column.filterValue = data.value;
        this.column.filteredColumn = data.column;
      }
    );

    this.subscriptionClear = this._eventAggregator.subscribe(
      "clearAllFilters",
      (data) => {
        for (const dropdown of this._dropdownManager.dropdowns) {
          let column = dropdown.column;
          let uniqueId = dropdown.uniqueId;
          column.filterValue = column.filteredColumn = "";
          this._eventAggregator.publish(
            "filterValueChanged_" + uniqueId,
            column
          );
        }
      }
    );
  }

  disposeEventListeners() {
    if (this.subscription) {
      this.subscription.dispose();
    }

    if (this.subscriptionClear) {
      this.subscriptionClear.dispose();
    }
  }
  //#endregion
  
  selectedColumnChanged(newValue) {
    if (this.typeFiltre == FiltreType.table) {
      if (!newValue) this.column = undefined;
      else
        this.selectedColumn?.attribute
          ? (this.column = this.columns.find(
              (column) => column.attribute === this.selectedColumn.attribute
            ))
          : (this.column = this.columns.find(
              (column) => column.field === this.selectedColumn.field
            ));
    }
  }
  /** Number of list items */
  @computedFrom("columns")
  get columnsToDisplay() {
    return this.columns?.filter(
      (item) => item.display == true 
      && item.filtrable == true 
      && item.type != ColumnTypes.Icon 
      && item.type != ColumnTypes.Html
    );
  }
}
