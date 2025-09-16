import { api, LightningElement } from "lwc";

const ITEMS = [
  { label: "Home", name: "home" },
  { label: "Profile", name: "profile" },
  { label: "Settings", name: "settings" },
  { label: "Help", name: "help" }
];

export default class DrawerSample extends LightningElement {
  @api label = "Menu";
  items = ITEMS;
  _selectedItem;

  @api
  get selectedItem() {
    return this._selectedItem;
  }
  set selectedItem(value) {
    this._selectedItem = value;
  }

  openDrawer() {
    const drawer = this.template.querySelector("c-drawer");

    if (!drawer) {
      return;
    }

    drawer.open();
  }

  handleItemClick(event) {
    const selectedItem = event.target.name;

    this._selectedItem = selectedItem;
  }
}
