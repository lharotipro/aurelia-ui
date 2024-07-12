export class EmailColumn {
  column;
  item;

  activate(model) {
    this.column = model.columnProperties;
    this.item = model.columnData;
  }
}
