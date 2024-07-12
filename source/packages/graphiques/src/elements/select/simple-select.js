/* eslint-disable unicorn/no-null */
import {
  DOM,
  inject,
  bindable,
  bindingMode,
  TaskQueue,
  BindingEngine,
  InlineViewStrategy
} from 'aurelia-framework';
import { Dropdown } from 'bootstrap';
import { generateUniqueId } from '../../core/functions';

/** @template T */
@inject(DOM.Element, BindingEngine, TaskQueue)
export class SimpleSelect {
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

  /** @type {string} */ uniqueId = generateUniqueId();
  /** @type {HTMLTemplateElement} */ _container;
  /** @type {HTMLInputElement} */ _input;
  /** @type {HTMLDivElement} */ _dropdownList;
  /** @type {Dropdown} */ _dropdown;

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
    this._input.value = item ? item[this.labelKey] : null;
    this.hideDropdown();
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
      this._dropdownList.querySelectorAll('button').item(0).focus();
    } else {
      this._input.focus();
    }
    return true;
  }

  /**
   * Logic triggered when "value" attribute is databound
   */
  valueChanged() {
    if (!this.valueKey) return;
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
    // if value was first databound before datasource re-trigger value change
    if (this.value) this.valueChanged();
  }
}
