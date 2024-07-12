import { Search } from './als.d'; 
export as namespace als;

export interface ICreatableFrom<T> {
  static fromObject(...source: any): T;
}

export type ValidationError = {
  errorMessage: string;
};

export type ProblemDetail = {
  status: number;
  title: string;
  detail: string | Record<string>;
  errors?: ValidationError[];
};

export type enumArray = 
{
  label : string, 
  enableTooltip: boolean = false,
  class: string
};

export type DialogServiceParameter = {
  viewModel: any;
  view?: string | ViewStrategy;
  model?: any;
  locked?: boolean;
};
export type DataSource = { 
  /**
  * Filtered data
  */
  data: any[] = []; 
  /**
  * Total ELements 
  */
  totalElements: number = 0;
}

export type ConfigGenericTable = {
  /**
   * The value to be used for filtering the table data. This can be a string representing the search term or a more complex value depending on your filter implementation.
   * A flag indicating whether to perform a server-side search on specific columns of the  table data based on the provided `filtrable` (if present on generic-columns propreties). 
   * Type: string | boolean (optional)
   */
  filterValue?: string | boolean;

  /**
   * The column to be used for filtering the table data. This is the name or identifier of the column to apply the filter to.
   * A flag indicating whether to perform a server-side search on specific columns of the  table data based on the provided `filtrable` (if present on generic-columns propreties). 
   * Type: string (optional)
   */
  filteredColumn?: string;

  /**
   * The current page number being displayed in the table. This helps with pagination and navigating through large datasets.
   * 
   * Type: number  
   */
  page?: number;  

  /**
   * The number of rows to be displayed per page in the table. This controls the amount of data shown at once.
   * 
   * Type: number  
   */
  pageSize?: number;  

  /**
   * Value to be set on the search input of the table
   * This is useful when you don't want to specify a specific column to filter on.
   * A flag indicating whether to perform a server-side search on the entire table data based on the provided `searchable` (if present on generic-table propreties). 
   * 
   * Type: string
   */
  searchText?: string;

  /**
   * The sort direction to be applied to the table data, either 'ASC' for ascending or 'DESC' for descending order. This allows users to sort columns by their values.
   * 
   * Type: string 
   */
  sortDirection: string;

  /**
   * The column to be used for sorting the table data. This is the name or identifier of the column to sort by.
   * 
   * Type: string
   */
  sortedColumn: string;
};

export type ActionParameter = {
  /**
   * Represents the way the action will be displayed.
   *  - if type equals 0 a button will be displayed as an action 
   *    - if label is specified the button will display the label on the button
   *    - if iconClass is specified the button will display an icon on the button
   *    - if both label & iconClass are specified the button will display icon + label on the button
   *    - At least one of these propreties must have a value
   *  - if type equals 1 an icon will be displayed as an action
   *    - iconSize represents the size of the icon and the label if specified. Default value is 5 & possible values : from 1 to 6
   *    - if label is specified the icon will display the label next to the icon
   *    - if iconClass is specified the icon will be display 
   *    - if both label & iconClass are specified the icon will be displayed icon and label next to it
   *    - At least one of these propreties must have a value 
   * @default 0   
   */ 
  type?: number = 0;
  /**
   * Represents the label that will be displayed in your table action. 
   */
  label?: string;
  /**
   * Represents the button class to use if the action type is 0 (button) . 
   */ 
  iconClass?: string;
  /**
   * Represents the icon class to use if the action type is 1 (icon) . 
   */ 
  iconClass?: string;
  /**
   * Represents the size of the icon and the label if specified .
   *  - possible values : from 1 to 6 
   * @default 5   
   */ 
  iconSize?: string;
  /**
   * Indicate if the action must be displayed or not . 
   * @default true   
   */ 
  display?: boolean;
   /**
   * Indicate the action to be executed when user click the icon or the button . 
   * @example 
   *    action: {
   *       handler: this.showAlert.bind(this)
   *     }
   * - this.showAlert represent my click event local function that will be executed
   */ 
  action: { handler : any }
};

export enum EnvironmentTypeEnum {
  dev,
  recette,
  preprod,
  prod
}

export type EnvironmentType = 'dev' | 'recette' | 'preprod' | 'prod';

export type EnvironmentDescriptor = {
  type: EnvironmentType;
  name: string;
};

export type RibbonPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export type AdressMode = 'zipCode' | 'address';

export type HttpClientFactory = () => HttpClient;

export type Search<T> = (text: string) => Promise<T[]>;
export type DisplayValueFormater<T> = (item: T) => string;
export type ItemModelBuilder<T, U> = (item: T) => T | U;

export type AddressAutoCompleteControllerConfiguration<T> = {
  requestFactory: (f: function) => Search<T>;
  buildItemModel: (item: T) => T;
};


 
 