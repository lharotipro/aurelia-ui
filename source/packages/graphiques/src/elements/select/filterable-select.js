/* eslint-disable unicorn/no-null */
import {
  DOM,
  inject,
  bindable,
  bindingMode,
  computedFrom,
  TaskQueue,
  BindingEngine,
  InlineViewStrategy
} from 'aurelia-framework';
import { Dropdown } from 'bootstrap';
import { generateUniqueId } from '../../core/functions';

/** @template T */
@inject(DOM.Element, BindingEngine, TaskQueue)
export class FilterableSelect {
  /** @type {T} */
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  value;

  /** @type {T[]} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  datasource;

  /** @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  placeholder;

  /** @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  valueKey = 'name';

  /** @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  labelKey = 'description';

  /** @type {Boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  disabled = false;

  /** @type {T[]} */ filteredItems;
  /** @type {string} */ _keyCode;

  /** @type {string} */ uniqueId = generateUniqueId();
  /** @type {HTMLTemplateElement} */ _container;
  /** @type {HTMLInputElement} */ _input;
  /** @type {HTMLDivElement} */ _dropdownList;
  /** @type {Dropdown} */ _dropdown;

  /** @type {Boolean} */ ignoringReset = false;
  /** @type {Boolean} */ updatingInput = false;

  /**
   * @param {HTMLTemplateElement} element
   * @param {BindingEngine} bindingEngine
   * @param {TaskQueue} taskqueue
   */
  constructor(element, bindingEngine, taskqueue) {
    this._container = element;
    this.bindingEngine = bindingEngine;
    this._taskqueue = taskqueue;
  }

  attached() {
    this.itemView = new InlineViewStrategy(`<template>\${${this.valueKey}}</template>`);
    this._input = this._container.querySelector(`#searchText_${this.uniqueId}`);
    this._dropdownList = this._container.querySelector(`#dropDown_${this.uniqueId}`);
    this._dropdown = Dropdown.getOrCreateInstance(this._input, { offset: [0, -1] });
  }

  detached() {
    this._dropdown?.dispose();
  }

  showDropdown() {
    this._dropdown?.show();
  }

  hideDropdown() {
    this._dropdown?.hide();
  }

  /**
   * Logic triggered when item is clicked or selected with 'Enter' key
   * @param {T} item
   * @param {boolean} notify
   */
  selectItem(item, notify = true) {
    if (!this.datasource || !this.valueKey || !this._input) return;
    this.value = item;
    this.updatingInput = true;
    this._input.value = item ? item[this.labelKey] ?? null : null;
    this.updatingInput = false;
    if (item) {
      this.hideDropdown();
      this.filteredItems = [item];
      this._input.blur();
    } else {
      this.resetItems();
    }
    if (notify) {
      const event = DOM.createCustomEvent('change', { bubbles: true, detail: item });
      this._taskqueue.queueMicroTask(() => this._container.dispatchEvent(event));
      const event2 = DOM.createCustomEvent('blur', { bubbles: true, detail: item });
      this._taskqueue.queueMicroTask(() => this._container.dispatchEvent(event2));
    }
  }

  /**
   * Logic triggered when user uses keyboard
   * @param {string} keyCode
   * @returns {boolean}
   */
  manageKey(keyCode) {
    this._keyCode = keyCode;
    // pass focus to first listitem when up/down/tab keys are pressed
    if (
      this._dropdownList?.children?.length &&
      (keyCode === 'ArrowUp' || keyCode === 'ArrowDown' || keyCode === 'Tab')
    ) {
      this.ignoringReset = true;
      this._dropdownList.querySelectorAll('button').item(0).focus();
      this.ignoringReset = false;
    } else {
      this._input.focus();
    }
    return true;
  }

  /**
   * Filter the items list to those that contain the given input value
   * @param {string} [inputValue]
   */
  filterItems(inputValue) {
    const filteredItems = inputValue
      ? this.datasource.filter(item => item[this.labelKey]?.toUpperCase().includes(inputValue.toUpperCase()))
      : this.datasource;
    this.filteredItems = filteredItems;
  }

  /**
   * Reset the items list to the original databound list
   */
  resetItems() {
    this.filteredItems = this.datasource;
  }

  /** Number of list items */
  @computedFrom('filteredItems')
  get filteredItemsCount() {
    return this.filteredItems?.length;
  }

  /**
   * Logic triggered when user clicks outside the component
   */
  resetInputValue() {
    if (!this.ignoringReset) {
      this.hideDropdown();
      this.selectItem(this.value, false);
    }
  }

  /**
   * Logic triggered when user enter data in the input field
   * @param {string} inputValue
   */
  inputValueChanged(inputValue) {
    if (this.updatingInput) return;
    if (inputValue === '') {
      this.value = undefined;
      this.resetItems();
      this.showDropdown();
      return;
    }
    this.filterItems(inputValue);
    if (this.filteredItemsCount === 1 && this._keyCode !== 'Backspace') {
      // for auto-completion
      this.selectItem(this.filteredItems[0]);
      return;
    }
    if (this.filteredItemsCount === 0) {
      this.hideDropdown();
    } else {
      this.showDropdown();
    }
  }

  /**
   * Logic triggered when "value" attribute is databound
   */
  valueChanged() {
    if (!this.valueKey || this.updatingInput) return;
    this.selectItem(this.value, false);
  }

  /**
   * Logic triggered when "value-key" attribute is databound
   * @param {string} valueKey
   */
  valueKeyChanged(valueKey) {
    this.itemView = new InlineViewStrategy(`<template>\${${valueKey}}</template>`);
  }

  /**
   * Logic triggered when "datasource" attribute is databound
   */
  datasourceChanged() {
    this.resetItems();
    // if value was first databound before datasource re-trigger value change
    if (this.value) this.valueChanged();
  }
}
