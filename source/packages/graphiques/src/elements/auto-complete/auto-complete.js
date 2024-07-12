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
// eslint-disable-next-line no-unused-vars
import { AutoCompleteController } from './auto-complete-controller';
import { generateUniqueId } from '../../core/functions';

/** @template T,U */
@inject(DOM.Element, BindingEngine, TaskQueue)
export class AutoComplete {
  /** @type {AutoCompleteController<T>} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  controller;

  /** @type {T} */
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  value;

  /** @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  placeholder;

  /** @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  valueKey = 'name';

  /** @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  labelKey = 'description';

  /** @type {Number} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  delay = 700;

  /** @type {Boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  disabled = false;

  /** @type {string} */ uniqueId = generateUniqueId();
  /** @type {HTMLTemplateElement} */ _container;
  /** @type {HTMLInputElement} */ _input;
  /** @type {HTMLDivElement} */ _dropdownList;
  /** @type {Dropdown} */ _dropdown;

  /** @type {T[]} */ items = [];
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
    if (!this.controller || !this.valueKey || !this._input) return;
    this.value = item;
    this.updatingInput = true;
    this._input.value = item ? item[this.labelKey] ?? null : null;
    this.updatingInput = false;
    if (item) {
      this.hideDropdown();
      this._input?.blur();
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
    // pass focus to first listitem when up/down/tab keys are pressed
    if (
      this._dropdownList?.children?.length > 0 &&
      (keyCode === 'ArrowUp' || keyCode === 'ArrowDown' || keyCode === 'Tab')
    ) {
      this.ignoringReset = true;
      this._dropdownList.querySelectorAll('button').item(0).focus();
      this.ignoringReset = false;
    }
    return true;
  }
  /**
   * Load the items from the controller
   * @param {string} inputValue
   */
  async loadItems(inputValue) {
    const results = await this.controller.search(inputValue);
    this.items = results;
  }

  /** Number of list items */
  @computedFrom('items')
  get itemsCount() {
    return this.items?.length;
  }

  /**
   * Logic triggered when user clicks outside the component
   */
  resetInputValue() {
    if (!this.ignoringReset) this.selectItem(this.value, false);
  }

  /**
   * Logic triggered when user enter data in the input field
   * @param {string} inputValue
   */
  async inputValueChanged(inputValue) {
    if (this.updatingInput) return;
    if (inputValue === '') {
      this.value = undefined;
      this.hideDropdown();
      return;
    }
    await this.loadItems(inputValue);
    this.showDropdown();
  }

  /**
   * Logic triggered when "value" attribute is databound
   * @param {T} value
   */
  valueChanged(value) {
    if (!this.controller || !this.valueKey || this.updatingInput) return;
    this.selectItem(this.controller.buildItemModel(value), false);
  }

  /**
   * Logic triggered when "value-key" attribute is databound
   * @param {string} valueKey
   */
  valueKeyChanged(valueKey) {
    this.itemView = new InlineViewStrategy(`<template>\${${valueKey}}</template>`);
  }
}
