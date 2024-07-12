export class LinkActionColumn {
  column;
  item;

  activate(model) {
    this.column = model.columnProperties;
    this.item = model.columnData;
  }

  executeAction(item, action) {
    if (action && action.handler) {
      action.handler(item);
    }
  }
}
