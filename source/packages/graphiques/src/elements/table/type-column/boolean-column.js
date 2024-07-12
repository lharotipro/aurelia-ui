export class BooleanColumn {
  column;
  item;

  activate(model) {
    this.column = model.columnProperties;
    this.item = model.columnData;
    if(this.item[this.column.field][this.column.attribute] === null)
    this.item[this.column.field][this.column.attribute] = 'NA'

    if( this.item[this.column.field][this.column.attribute] != 'NA' && this.item[this.column.field] === null)
    this.item[this.column.field] = 'NA';
  }
}
