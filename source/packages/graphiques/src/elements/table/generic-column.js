import { bindable, customElement } from "aurelia-framework"; 
import { ColumnTypes, BadgeTypes, TooltipPosition  } from "../../core/constant";
@customElement("generic-column")
export class GenericColumn {
  /**
   * @type {ColumnTypes}
   * @description représente le type de la colonne
   * @default "text"
   */
  @bindable type = ColumnTypes.Text;

  /**
   * @type {string}
   * @description représente le texte d'affichage de la colonne
   * */
  @bindable header;

  /**
   * @type {string}
   * @description représente le champ dans votre source de données,
   * si votre champ est un objet, utilisez également la propriété 'attribute' afin de cibler le champ dans votre objet
   */
  @bindable field;
  @bindable dateFormat;

  /**
   * @type {string}
   * @description représente le champ à de cibler si la propriété 'field' est un objet
   * */
  @bindable attribute;

  /**
   * @type {boolean}
   * @description pour indiquer s'il faut afficher ou non la colonne
   * @default "false"
   * */
  @bindable display = true;

  /**
   * @type {string}
   * @description pour indiquer l'icon à utiliser
   * @example
   * To use this icon, use the following value in :
   * '<i class=''bi bi-person''></i>' iconClass must have 'person' as a value.
   */
  @bindable iconClass;

  /**
   * @type {number}
   * @description pour indiquer la taille de l'icon à utiliser :  valeurs de 0 à 6
   * @default 5
   */
  @bindable iconSize = 5;

  /**
   * @type {boolean}
   * @description pour indiquer s'il faut afficher ou non tooltip sur l'icon uniquement
   * @default "false"
   */
  @bindable showIconTooltip = false;
  /**
   * @type {TooltipPosition}
   * @description pour indiquer la position du tooltip sur l'icon uniquement
   * @default "bottom"
   */
  @bindable iconTooltipPosition = TooltipPosition.Bottom;

  /**
   * @type {string}
   * @description utiliser cette propriéte pour indiquer le texte à afficher dans le tooltip , si vide la valeur du champ field ou attribute seront utilisé
   */
  @bindable iconTooltipText = "";

  /**
   * @type {boolean}
   * @description pour indiquer si la colonne peut être triée ou non
   * @default "false"
   */
  @bindable sortable = false;

  /**
   * @type {{handler : string}}
   * @description  utilisé uniquement dans le type de colonne linkAction pour spécifier le nom de la fonction à appeler lorsque l'utilisateur clique sur le lien
   */ 
  @bindable action;

  /**
   * @type { string }
   * @description pour indiquer la couleur de l'arriére plan du badge à utiliser  
   */
  @bindable elementClass;
  /**
   * @type { als.enumArray[] }
   * @description Tableaux de type enumArray utilisé uniquement dans le type de colonne enum pour faire correspondre une valeur avec un style de badge spécifique  
   */
  @bindable enumArray;
 

  /**
   * @type {boolean}
   * @description pour indiquer si la colonne peut être filtrer ou non
   * @default "false"
   */
  @bindable filtrable = false;

  /**
   * @type {string}
   * @description représente la valeur que l'utilisateur a saisie, sélectionnée ou choisie pour être utilisée dans le filtre
   */
  @bindable filterValue;
  /**
   * @type {string}
   * @description représente la colonne à filtrer
   */
  @bindable filteredColumn;

   /**
   * @type {boolean}
   * @description pour indiquer si ellipsis peut être activer sur long text - Tooltip will show the whole text
   * @default "false"
   */
   @bindable ellipsis = false;

  toColDef() {
    return {
      type: this.type,
      header: this.header,
      field: this.field,
      dateFormat: this.dateFormat,
      sortable: this.sortable === true,
      action: this.action,
      attribute: this.attribute,
      display: this.display === true,
      iconClass: this.iconClass,
      iconSize: this.iconSize,
      elementClass: this.elementClass,
      enumArray: this.enumArray, 
      iconArray: this.iconArray,
      showIconTooltip: this.showIconTooltip === true,
      iconTooltipPosition: this.iconTooltipPosition,
      iconTooltipText: this.iconTooltipText,
      filtrable: this.filtrable === true,
      filterValue: this.filterValue,
      filteredColumn: this.filteredColumn,
      ellipsis: this.ellipsis
    };
  }
}
