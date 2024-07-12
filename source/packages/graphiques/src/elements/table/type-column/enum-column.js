import { DOM, bindable} from 'aurelia-framework';
import { Tooltip } from 'bootstrap'; 
export class EnumColumn {
  column;
  item;
  tooltips = [];
  @bindable isTooltipEnabled = false;
  @bindable isIconClassPresent = false;
  activate(model) {
    this.column = model.columnProperties;
    this.item = model.columnData; 
  }
  attached() { 
      this.initializeTooltips(); 
  }

  detached() {
    this.disposeTooltips();
  }

  initializeTooltips() {
    this.disposeTooltips(); // Dispose of any existing tooltips

    const tooltipTriggerList = DOM.querySelectorAll('[data-bs-toggle="tooltip"]');
    this.tooltips = Array.from(tooltipTriggerList).map(tooltipTriggerEl => {
      if (tooltipTriggerEl instanceof Element) {
        return new Tooltip(tooltipTriggerEl);
      }
    });
  }

  disposeTooltips() {
    this.tooltips.forEach(tooltip => tooltip.dispose());
    this.tooltips = [];
  }
  getElementClass(label) {
    if (this.column.enumArray) {
      for (const obj of this.column.enumArray) {
        if (obj.label === label) {
          return obj.class;
        }
      }
    }

    return this.column.elementClass.length > 0
      ? this.column.elementClass
      : "badge bg-primary";
  }
  getElementClass(label) {
    if (this.column.enumArray) {
      for (const obj of this.column.enumArray) {
        if (obj.label === label) {
          this.isTooltipEnabled = obj.enableTooltip;
          this.isIconClassPresent = this.hasBiWords(obj.class);
          return obj.class;
        }
      }
    }

    return this.column.elementClass.length > 0
      ? this.column.elementClass
      : "badge bg-primary";
  }

  hasBiWords(text) {
    if (!text) { // Handle empty string case
      return false;
    }
    return text.toLowerCase().includes('bi') && text.toLowerCase().includes('bi-');
  }
}
