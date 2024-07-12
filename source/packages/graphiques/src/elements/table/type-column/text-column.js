export class TextColumn {
  column;
  item;

  activate(model) { 
    this.column = model.columnProperties;
    this.item = model.columnData;
  }
}
