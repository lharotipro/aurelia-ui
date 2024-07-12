import { bindable, inject, NewInstance } from "aurelia-framework";
import environment from "./environment"; 
export const wait = (delay) =>
  new Promise((resolve) => setTimeout(resolve, delay));
import { AutoCompleteController } from "resources/elements/auto-complete/auto-complete-controller";
@inject(NewInstance.of(AutoCompleteController))
export class App {
  /** @type {AutoCompleteController<any> } */ utilisateurAutoCompleteController;
  btnOne = false;
  btnTwo = false;
  /** @type {string} */ dateNaissance;
  booleanValue = false;
  @bindable pageSize = 10;
  @bindable totalElements = 50;
  @bindable totalElementsShift = 1;
  @bindable searchable = true;
  @bindable filterType = "table";
  @bindable refreshable = true;
  @bindable filtrable = true;
  @bindable searchText = "";
  @bindable dataSource = [];
  @bindable currentPage = 1;
  @bindable dataSourceSimpleSelect = [
    {
      code: "CAPP_DEV_USR01@actionlogement.fr",
      description: "Utilisateur TEST",
    },
    { code: "EV05907@actionlogement.fr", description: "Vincent CARITEY" },
    { code: "EK82397@actionlogement.fr", description: "Yassine LHAROTI" },
    { code: "EF09960@actionlogement.fr", description: "Mostapha EL AOUAD 60" },
    { code: "EF09969@actionlogement.fr", description: "Mostapha EL AOUAD" },
    { code: "ES06604@actionlogement.fr", description: "Mohamed AGUARMOUZ" },
    {
      code: "IM15675@actionlogement.fr",
      description: "Marie-Ségolène LABERTY",
    },
    { code: "EQ04184@actionlogement.fr", description: "Tatiana ANDRIANASOLO" },
    { code: "EL54314@actionlogement.fr", description: "Chaouki RJILI" },
  ];
  @bindable selectedMessage;
  @bindable dataSourceShift = [];
  @bindable exportTypes = ["csv", "xlsx"];
  @bindable gridActions = [
    {
      label: "View",
      type: 'button',
      class: "outline-info text-center",
      action: {
        handler: this.actionHandle.bind(this),
      },
    },
    {
      label: "Badge",
      iconClass: "bi bi-person-badge-fill",
      type: 'button',
      class: "outline-primary text-center",
      display: true,
      action: {
        handler: this.actionHandle.bind(this),
      },
    },
    {
      iconClass: "bi bi-cone",
      type: 'button',
      class: "outline-warning text-center",
      action: {
        handler: this.actionHandle.bind(this),
      },
    },
    {
      label: "consultation",
      type: 'icon',
      class: "text-center text-danger",
      iconClass: "bi bi-trash",
      iconSize: "6",
      action: {
        handler: this.actionHandle.bind(this),
      },
    },
    {
      label: "View",
      type: 'button',
      class: "outline-info text-center",
      action: {
        handler: this.actionHandle.bind(this),
      },
    },
    {
      iconClass: "bi bi-person-badge-fill",
      type: 'icon',
      class: "outline-success text-center",
      display: true,
      action: {
        handler: this.actionHandle.bind(this),
      },
    },
  ];
  BadgeArrayData = [
    {
      label: "Badge success",
      class: "badge bg-success",
    },
    {
      label: "Badge warning",
      class: "badge bg-warning",
    },
    {
      label: "Badge primary",
      class: "badge bg-primary",
    },
    {
      label: "Badge dark",
      class: "badge bg-dark",
    },
    {
      label: "Badge danger tooltip",
      enableTooltip: true,
      class: "badge bg-danger",
    },
    {
      label: "Badge with icon",
      class: "badge bg-success bi bi-people",
    },
    {
      label: "Badge with icon tooltip",
      enableTooltip: true,
      class: "badge bg-light text-dark bi bi-trash",
    },
    {
      label: "icon & text",
      class: "bi bi-chat-right-text",
    },
    {
      label: "icon & text color",
      class: "bi bi-chat-quote text-primary",
    },
    {
      label: "icon only with tooltip",
      enableTooltip: true,
      class: "bi bi-bookmark-check-fill text-success fw-semibold",
    },
    {
      label: "text colored only",
      class: "fw-semibold text-danger",
    },
    {
      label: "text only",
      class: "fw-semibold",
    },
  ];
  IconArrayData = [
    {
      label: "primary icon",
      class: "bi bi-people text-primary",
      enableTooltip: true,
    },
    {
      label: "secondary icon",
      class: "bi bi-people text-dark badge bg-warning",
      enableTooltip: true,
    },
    {
      label: "red icon",
      class: "bi bi-trash text-danger",
      enableTooltip: true,
    },
    {
      label: "green icon",
      class: "bi bi-check text-success",
      enableTooltip: true,
    },
    {
      label: "warning icon",
      class: "bi bi-x text-warning",
      enableTooltip: true,
    },
  ];
  selectedMessage;
  selectedMessages = [];
  /**
   * @param {AutoCompleteController} utilisateurAutoCompleteController
   * @param {ToastService} toast
   */
  constructor(utilisateurAutoCompleteController, toast) {
    this.environment = environment.environment;
    this.utilisateurAutoCompleteController = utilisateurAutoCompleteController;
    this._toast = toast;
  }

  activate() {
    const searchUtilisateurs = this.loadUsers.bind(this._service);
    this.utilisateurAutoCompleteController.configure(searchUtilisateurs);
 
    this.disabledDates = [];
  }
  async lockScreen() {
    this.booleanValue = true;
    await wait(1000).finally(() => (this.booleanValue = false));
  }
  async bindGrid(configPage) {
    console.log("Data to be used to refresh the grid");
    console.log(configPage);
    //here the return of the config page from the method onPageChange (page number, sort column and sort direction, searchText)
    const event = new Date();

    this.dataSource = [];
    this.dataSource.push({
      dateCreation: this.getRandomDate("01/01/2019", "01/01/2026"),
      badge: "Badges pages " + configPage.sortedColumn,
      text: "Texts   pages " + configPage.sortedDirection,
      textlg: this.generateLongText(500),
      icon: {
        badge: this.generateRandomIconValue(),
        badgeC: null,
      },
      badgeEnum: this.generateRandomValue(),
      iconEnum: this.generateRandomIconValue(),
      mail: this.generateRandomValue() + "@Alss.com",
      website: this.getRandomWebsite(),
      actionLink: "showAlert",
    });
    for (let index = 0; index < this.totalElements; index++) {
      const valueBadgeRandom = this.generateRandomValue();
      const valueIconRandom = this.generateRandomIconValue();
      this.dataSource.push({
        dateCreation: this.getRandomDate("01/01/2019", "01/01/2026"),
        badge: "Badge " + index + " page " + configPage.sortedColumn,
        text: "Text " + index + " page " + configPage.sortedDirection,
        textlg: this.generateLongText(500),
        icon: {
          badge: this.generateRandomIconValue(),
          badgeC: this.getRandomBoolean(),
        },
        badgeEnum: valueBadgeRandom,
        iconEnum: valueIconRandom,
        mail: valueBadgeRandom + "@Als.com",
        website: this.getRandomWebsite(),
        actionLink: "showAlert",
      });
    }
    return { data : this.dataSource,totalElements : 51 };
  }
  LoadData(){
    return this.bindGrid({});
  }
  loadUsers(service) {
    console.log(service);
    const lowerCaseSearchText = service.toLowerCase();
    const data = [
      {
        code: "CAPP_DEV_USR01@actionlogement.fr",
        description: "Utilisateur TEST",
      },
      { code: "EV05907@actionlogement.fr", description: "Vincent CARITEY" },
      { code: "EK82397@actionlogement.fr", description: "Yassine LHAROTI" },
      {
        code: "EF09960@actionlogement.fr",
        description: "Mostapha EL AOUAD 60",
      },
      { code: "EF09969@actionlogement.fr", description: "Mostapha EL AOUAD" },
      { code: "ES06604@actionlogement.fr", description: "Mohamed AGUARMOUZ" },
      {
        code: "IM15675@actionlogement.fr",
        description: "Marie-Ségolène LABERTY",
      },
      {
        code: "EQ04184@actionlogement.fr",
        description: "Tatiana ANDRIANASOLO",
      },
      { code: "EL54314@actionlogement.fr", description: "Chaouki RJILI" },
    ];
    return data.filter(
      (item) =>
        item.code.toLowerCase().includes(lowerCaseSearchText) ||
        item.description.toLowerCase().includes(lowerCaseSearchText)
    );
  }
  // #region function to populate table with data
  getRandomDate(startDate = "01/01/2019", endDate = "01/01/2026") {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const DATE = new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );

    return DATE.toISOString();

    // const day = String(randomDate.getDate()).padStart(2, '0');
    // const month = String(randomDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    // const year = randomDate.getFullYear();

    // return `${day}/${month}/${year}`;
  }
  generateLongText(length, word = "lorem ipsum dorum") {
    let result = "";
    while (result.length < length) {
      result += `${word} `;
    }
    return result.substring(0, length); // Trim the result to the desired length
  }
  async bindGridShift(configPage) {
    this.totalElementsShift = this.dataSourceShift.length;
    return this.dataSourceShift;
  }
  getRandomBoolean() {
    return Math.random() >= 0.5;
  }
  generateRandomValue() {
    const randomIndex = Math.floor(Math.random() * this.BadgeArrayData.length);
    return this.BadgeArrayData[randomIndex].label;
  }
  generateRandomIconValue() {
    const randomIndex = Math.floor(Math.random() * this.IconArrayData.length);
    return this.IconArrayData[randomIndex].label;
  }
  showAlert(data) {
    window.alert(
      "Your click called show alert function , you can use me to perform your redirection as well ."
    );
  }
  async actionHandle() {
    // this._toast.success('Vous avez recherché ce texte ');
    this.booleanValue = true;
    await wait(1000).finally(() => (this.booleanValue = false));
    this.gridActions = [
      {
        label: "Badge",
        iconClass: "bi bi-person-badge-fill",
        type: 'button',
        class: "outline-primary text-center",
        display: true,
        action: {
          handler: this.actionHandleTwo.bind(this),
        },
      },
      {
        label: "View",
        type: 'button',
        display: true,
        class: "outline-info text-center",
        action: {
          handler: this.actionHandleTwo.bind(this),
        },
      },
      {
        iconClass: "bi bi-cone",
        type: 'icon',
        display: true,
        class: "outline-warning text-center",
        action: {
          handler: this.actionHandleTwo.bind(this),
        },
      },
      {
        label: "consultation",
        type: 'button',
        display: true,
        class: "text-center text-danger",
        iconClass: "bi bi-trash",
        iconSize: "6",
        action: {
          handler: this.actionHandleTwo.bind(this),
        },
      },
      {
        type: 'button',
        display: true,
        class: "text-center text-success",
        iconClass: "bi bi-people",
        iconSize: "6",
        action: {
          handler: this.actionHandleTwo.bind(this),
        },
      },
    ];
    this.bindGrid({});
  }
  actionHandleTwo() {
    this.btnOne = true;
    this.btnTwo = false;
    this.gridActions = [
      {
        label: "Badge",
        iconClass: "bi bi-person-badge-fill",
        type: 'button',
        class: "outline-primary text-center",
        display: true,
        action: {
          handler: this.actionHandle.bind(this),
        },
      },
    ];
    this.bindGrid({});
  }
  websites = [
    "https://www.google.com",
    "https://www.azure.com",
    "https://www.amazon.com",
    "https://www.microsoft.com",
    "https://www.apple.com",
  ];
  // Function to generate a random website URL
  getRandomWebsite() {
    const randomIndex = Math.floor(Math.random() * this.websites.length);
    return this.websites[randomIndex];
  }
  // #endregion
}
