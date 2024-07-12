import { DOM } from 'aurelia-framework';
import { Tooltip } from 'bootstrap';

export class IconColumn {
  column;
  item;
  tooltips = [];

  activate(model) {
    this.column = model.columnProperties;
    this.item = model.columnData;  
    if (this.column.showIconTooltip) {
      this.initializeTooltips();
    }
  }

  attached() {
    if (this.column.showIconTooltip) {
      this.initializeTooltips();
    }
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
}
