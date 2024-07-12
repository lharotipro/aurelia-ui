// dropdown-manager.js
export class DropdownManager {
  constructor() {
    if (DropdownManager.instance) {
      return DropdownManager.instance;
    }

    this.dropdowns = new Set();
    DropdownManager.instance = this;
  }

  register(dropdown) {
    this.dropdowns.add(dropdown);
  }

  unregister(dropdown) {
    this.dropdowns.delete(dropdown);
  }

  closeAll(except) {
    this.dropdowns.forEach(dropdown => {
      if (dropdown !== except) {
        dropdown.closeDropdown();
      }
    });
  }
}
