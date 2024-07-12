export class DateColumn {
  column;
  item;
  format;

  activate(model) {
    this.column = model.columnProperties;
    this.item = model.columnData;
    this.format = this.column.dateFormat
  }
}
