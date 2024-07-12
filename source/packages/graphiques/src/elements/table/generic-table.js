import {
  bindable,
  DOM,
  inject,
  customElement,
  computedFrom,
} from "aurelia-framework";
import { ActionTypeOptions, FiltreType } from "../../core/constant";
import { EventAggregator } from "aurelia-event-aggregator";
import { DropdownManager } from "../../core/dropdown-manager";
import { Tooltip } from "bootstrap";
@inject(DOM.Element, EventAggregator, DropdownManager)
@customElement("generic-table")
export class GenericTable {
  @bindable pageSize = 10;
  currentPage = 1;
  clearFilters = false;
  sortedColumn = "";
  sortDirection = "ASC";
  actionTypeOptions = ActionTypeOptions;
  filteredColumn = "";
  filterValue = "";
  elementsPerPage = [
    {
      key: 5,
    },
    {
      key: 10,
    },
    {
      key: 25,
    },
    {
      key: 50,
    },
    {
      key: 100,
    },
  ];
  data = [];
  totalElements = 0;

  @bindable searchText = "";
  /**
   * represent the table list of columns
   * @type {any[]}
   */
  @bindable columns;

  /**
   * represent the function that loads the data into the table
   * @type {Promise<als.DataSource>}
   * @class DataSource = {
   *   data: any[];
   *   totalElements: number;
   *   }
   */
  @bindable onChange;

  /**
   * represent the list of actions to set up in the table
   * @type {als.ActionParameter[]}
   */
  @bindable actions = [];

  /**
   * indicate if you want to enable the search option
   * @type {boolean}
   */
  @bindable searchable = false;

  /**
   * indicate if you want to enable the filter option
   * @type {boolean}
   */
  @bindable filtrable = false;
  /**
   * indicate if you want to enable the refresh button
   * @type {boolean}
   */
  @bindable refreshable = false;

  /**
   * represent the start up configuration of the generic table ,you can specify default sort & filter & page informations
   * @type {als.ConfigGenericTable[]}
   */
  @bindable configPage = undefined;

  /**
   * Represent the way the table filter will be displayed.
   *  - if filter type equals 'column' a filter icon will be enabled in each column
   *  - if filter type equals 'table' a filter icon will be enabled in the table header, allows you to select the column and apply filter
   * @default 'table'
   */
  @bindable filterType = FiltreType.table;

  /**
   *
   * @type {als.DataSource}
   */
  @bindable dataSource;

  /** @type {HTMLTemplateElement} */
  _container;

  /**
   * @param {HTMLTemplateElement} element
   * @param {EventAggregator} eventAggregator
   * @param {DropdownManager} dropdownManager
   */
  constructor(element, eventAggregator, dropdownManager) {
    this._container = element;
    this._eventAggregator = eventAggregator;
    this._dropdownManager = dropdownManager;
  }

  // #region Table functions

  async attached() {
    this.initTooltips();
    this.setupEventListeners();
    this.initGenericTable();
  }

  async initGenericTable() {
    this.currentPage = 1;
    this.columns = await this.extractColumns();
    await this._buildTableDefaultConfig();
    await this._onChange();
    this.clearFilters = this.filterType == FiltreType.column ? true : false;
  }

  initTooltips() {
    const tooltipTriggerList = DOM.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    this.tooltips = Array.from(tooltipTriggerList).map((tooltipTriggerEl) => {
      if (tooltipTriggerEl instanceof Element) {
        return new Tooltip(tooltipTriggerEl);
      }
    });
  }

  detached() {
    this.disposeEventListeners();
  }

  async _onChange() {
    const changeData = await this._buildChangeData();
    this.onChange(changeData).then((response) => {
      if (Array.isArray(response.data)) {
        this.data = response.data;
        this.totalElements = response.totalElements;
      } else {
        console.warn(
          "Generic Table : Table loading function did not return an array. Received:",
          response
        );
        this.data = [];
        this.totalElements = 0;
      }
    });
  }

  dataSourceChanged(newValue, oldValue) {
    if (newValue != undefined) {
      this.data = newValue.data;
      this.totalElements = newValue.totalElements;
    }
  }

  changePageSize(event) {
    this.currentPage = 1;
    this.pageSize = parseInt(event.target.value);
    this._onChange();
  }

  sort(column) {
    this.sortedColumn = column.field;
    this.sortDirection = this.sortDirection === "ASC" ? "DESC" : "ASC";
    this._onChange();
  }

  paginate(page) {
    if (this.totalPages === 1) page = 1;

    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this._onChange();
    }
  }

  clearAllFilters() {
    this.filterValue = "";
    this.filteredColumn = "";
    this.searchText = "";
    this._eventAggregator.publish("clearAllFilters", true);
    this._onChange();
  }

  searchTextChanged() {
    this._onChange();
  }

  refreshTable() {
    this._onChange();
  }

  async _buildTableDefaultConfig() {
    // current page
    if (this.configPage?.page) this.page = this.configPage?.page;
    // page size
    if (
      this.configPage?.pageSize &&
      this.elementsPerPage.some(
        (option) => option.key === this.configPage?.pageSize
      )
    )
      this.pageSize = this.configPage?.pageSize;
    // column to sort
    if (this.configPage?.sortedColumn)
      this.sortedColumn = this.configPage?.sortedColumn;
    // column sort direction
    if (
      this.configPage?.sortDirection &&
      this.configPage?.sortedColumn &&
      this.columns.includes(this.sortedColumn)
    )
      this.sortDirection = this.configPage?.sortDirection;
    // column to filtre
    if (this.configPage?.filteredColumn)
      this.filteredColumn = this.configPage?.filteredColumn;
    // value of filtre
    if (
      this.configPage?.filterValue &&
      this.configPage?.filteredColumn &&
      this.columns.includes(this.filteredColumn)
    )
      this.filterValue = this.configPage?.filterValue;
    // value of local search text
    if (this.configPage?.searchText)
      this.searchText = this.configPage?.searchText;

    return true;
  }

  async _buildChangeData() {
    const changeData = {
      // current page
      page: this.currentPage,
      // page size
      pageSize: this.pageSize,
      // column to sort
      sortedColumn: this.sortedColumn,
      // column sort direction
      sortDirection: this.sortDirection,
      // column to filtre
      filteredColumn: this.filteredColumn,
      // value of filtre
      filterValue: this.filterValue,
      // value of local search text
      searchText: this.searchText,
    };
    return changeData;
  }

  totalElementsChanged(newValue, oldValue) {
    this.currentPage = 1;
  }

  async extractColumns() {
    if (!this.columns) {
      const columns = this._container?.querySelectorAll("generic-column");
      const columnDefinitions = [];
      for (const column of columns) {
        // @ts-ignore
        const columnViewModel = column.au.controller.viewModel;
        if (columnViewModel) {
          const columnDefinition = columnViewModel.toColDef();
          columnDefinitions.push(columnDefinition);
        }
      }

      return columnDefinitions;
    }

    return this.columns;
  }

  executeAction(item, action) {
    if (action && action.handler) {
      action.handler(item);
    }
  }
  // #endregion

  // #region EventListeners
  setupEventListeners() {
    this.subscription = this._eventAggregator.subscribe(
      "filterApplied",
      (data) => {
        if(this.filtrable){
          if(data){
            this.filterValue = data.filterValue;
            this.filteredColumn = data.filteredColumn;
          }else{
            this.filterValue = '';
            this.filteredColumn = '';
          } 
        }
        
        if(this.searchable)
        this.searchTextChanged("");

        this.currentPage = 1;
        this._onChange();
      }
    );
  }
  disposeEventListeners() {
    if (this.subscription) {
      this.subscription.dispose();
    }
  }
  // #endregion

  // #region @computedFrom
  get totalPages() {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  get getVisiblePages() {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;

    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, start + 2);

    // Adjust start if end is less than 3
    if (end - start < 2) {
      start = Math.max(1, end - 2);
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }

  @computedFrom("data")
  get visibleItems() {
    return this.data ? this.data.slice(0, this.pageSize) : [];
  }

  @computedFrom("currentPage")
  get isFirstButtonDisabled() {
    return this.currentPage === 1;
  }

  @computedFrom("currentPage", "totalPages")
  get isLastButtonDisabled() {
    return this.currentPage === this.totalPages;
  }
  // #endregion
}
