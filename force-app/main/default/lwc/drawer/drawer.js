import { api, LightningElement } from "lwc";
const MOTION_DURATION = 300;

export default class Drawer extends LightningElement {
  @api label = "";
  _isDrawerOpen = false;
  _observer;
  selectedItem = null;
  backdropCss = "";

  @api
  get isDrawerOpen() {
    return this._isDrawerOpen;
  }

  set isDrawerOpen(value) {
    this._isDrawerOpen = !!value;
  }

  @api async open() {
    this._isDrawerOpen = true;

    await Promise.resolve(); // Wait for the DOM to update

    this.setUpMutationObserver();

    const openEvent = new CustomEvent("draweropen", {
      bubbles: true,
      composed: true
    });

    this.dispatchEvent(openEvent);

    const container = this.template.querySelector('[data-id="container"]');

    if (!container) {
      return;
    }

    const drawer = this.template.querySelector('[data-id="drawer"]');

    if (!drawer) {
      return;
    }

    const content = this.template.querySelector('[data-id="content"]');

    if (content) {
      content.addEventListener("click", this.handleClose.bind(this));
    }

    const backdrop = this.template.querySelector('[data-id="backdrop"]');

    if (backdrop) {
      backdrop.classList.add("drawer-backdrop-motion_opening");
      backdrop.classList.remove("slds-hide");

      setTimeout(function () {
        backdrop.classList.add("drawer-backdrop");
        backdrop.classList.add("drawer-backdrop_open");
        backdrop.classList.remove("drawer-backdrop-motion_opening");
      }, MOTION_DURATION);
    }

    container.classList.add("drawer-motion_opening");

    setTimeout(function () {
      container.classList.remove("drawer-motion_opening");
    }, MOTION_DURATION);

    drawer.focus();
  }

  handleClose() {
    this.setUpMutationObserver();

    const closeEvent = new CustomEvent("drawerclose", {
      bubbles: true,
      composed: true
    });

    this.dispatchEvent(closeEvent);

    const container = this.template.querySelector('[data-id="container"]');

    if (container) {
      container.classList.add("drawer-motion_closing");
    }
  }

  setUpMutationObserver() {
    const container = this.template.querySelector('[data-id="container"]');

    if (!container || this._observer) {
      return;
    }

    const callback = (mutationList) => {
      for (const mutation of mutationList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const isClosing = container.classList.contains(
            "drawer-motion_closing"
          );
          const isOpening = container.classList.contains(
            "drawer-motion_opening"
          );

          if (isOpening) {
            this._isDrawerOpen = true;
            container.classList.remove("drawer-motion_opening");
            return;
          }

          if (isClosing) {
            const backdrop = this.template.querySelector(
              '[data-id="backdrop"]'
            );

            if (backdrop) {
              backdrop.classList.add("drawer-backdrop-motion_closing");

              setTimeout(function () {
                backdrop.classList.remove("drawer-backdrop-motion_closing");
                backdrop.classList.remove("drawer-backdrop");
                backdrop.classList.remove("drawer-backdrop_open");
                backdrop.classList.add("slds-hide");
              }, MOTION_DURATION);
            }

            // es-lint-disable-next-line lwc/no-async-operation
            setTimeout(
              function () {
                this._isDrawerOpen = false;
                container.classList.remove("drawer-motion_closing");
              }.bind(this),
              MOTION_DURATION
            );
            return;
          }
        }
      }
    };

    const observer = new MutationObserver(callback);

    observer.observe(container, { attributes: true });
  }

  connectedCallback() {
    this.setUpMutationObserver();
  }
}
