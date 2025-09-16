import { api, LightningElement } from "lwc";

const MOTION_DURATION = 300;
const SELECTORS = {
  CONTAINER: '[data-id="container"]',
  DRAWER: '[data-id="drawer"]',
  CONTENT: '[data-id="content"]',
  BACKDROP: '[data-id="backdrop"]'
};

const CSS_CLASSES = {
  BACKDROP: "drawer-backdrop",
  BACKDROP_OPEN: "drawer-backdrop_open",
  BACKDROP_OPENING: "drawer-backdrop-motion_opening",
  BACKDROP_CLOSING: "drawer-backdrop-motion_closing",
  MOTION_OPENING: "drawer-motion_opening",
  MOTION_CLOSING: "drawer-motion_closing",
  SLDS_HIDE: "slds-hide"
};

export default class Drawer extends LightningElement {
  @api label = "";
  _isDrawerOpen = false;
  _observer;
  _drawerCloseResolver;
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

    await Promise.resolve();

    this.setUpMutationObserver();
    this.dispatchCustomEvent("draweropen");

    const elements = this.getElements();

    if (!elements.container || !elements.drawer) {
      return Promise.reject(
        new Error("Drawer: Missing required elements in the template.")
      );
    }

    this.animateBackdropOpen(elements.backdrop);
    this.animateContainerOpen(elements.container);

    elements.drawer.focus();

    if (this._drawerCloseResolver) {
      return this._drawerCloseResolver;
    }

    return new Promise((resolve) => {
      this._drawerCloseResolver = resolve;
    }).then(() => {
      this._drawerCloseResolver = null;
    });
  }

  handleClose() {
    this.setUpMutationObserver();
    this.dispatchCustomEvent("drawerclose");

    const container = this.template.querySelector(SELECTORS.CONTAINER);

    if (container) {
      container.classList.add(CSS_CLASSES.MOTION_CLOSING);
    }
  }

  getElements() {
    return {
      container: this.template.querySelector(SELECTORS.CONTAINER),
      drawer: this.template.querySelector(SELECTORS.DRAWER),
      content: this.template.querySelector(SELECTORS.CONTENT),
      backdrop: this.template.querySelector(SELECTORS.BACKDROP)
    };
  }

  dispatchCustomEvent(eventName) {
    const event = new CustomEvent(eventName, {
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  animateBackdropOpen(backdrop) {
    if (!backdrop) {
      return;
    }

    backdrop.classList.add(CSS_CLASSES.BACKDROP_OPENING);
    backdrop.classList.remove(CSS_CLASSES.SLDS_HIDE);

    setTimeout(() => {
      backdrop.classList.add(CSS_CLASSES.BACKDROP, CSS_CLASSES.BACKDROP_OPEN);
      backdrop.classList.remove(CSS_CLASSES.BACKDROP_OPENING);
    }, MOTION_DURATION);
  }

  animateContainerOpen(container) {
    container.classList.add(CSS_CLASSES.MOTION_OPENING);
    setTimeout(() => {
      container.classList.remove(CSS_CLASSES.MOTION_OPENING);
    }, MOTION_DURATION);
  }

  animateBackdropClose(backdrop) {
    if (!backdrop) {
      return;
    }

    backdrop.classList.add(CSS_CLASSES.BACKDROP_CLOSING);

    setTimeout(() => {
      backdrop.classList.remove(
        CSS_CLASSES.BACKDROP_CLOSING,
        CSS_CLASSES.BACKDROP,
        CSS_CLASSES.BACKDROP_OPEN
      );
      backdrop.classList.add(CSS_CLASSES.SLDS_HIDE);
    }, MOTION_DURATION);
  }

  setUpMutationObserver() {
    const container = this.template.querySelector(SELECTORS.CONTAINER);

    if (!container || this._observer) {
      return;
    }

    const callback = function (mutationList) {
      for (const mutation of mutationList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          this.handleClassMutation(container);
        }
      }
    }.bind(this);

    this._observer = new MutationObserver(callback);
    this._observer.observe(container, { attributes: true });
  }

  handleClassMutation(container) {
    const isClosing = container.classList.contains(CSS_CLASSES.MOTION_CLOSING);
    const isOpening = container.classList.contains(CSS_CLASSES.MOTION_OPENING);

    if (isOpening) {
      this._isDrawerOpen = true;
      container.classList.remove(CSS_CLASSES.MOTION_OPENING);

      return;
    }

    if (isClosing) {
      const backdrop = this.template.querySelector(SELECTORS.BACKDROP);
      this.animateBackdropClose(backdrop);

      setTimeout(
        function () {
          this._isDrawerOpen = false;

          container.classList.remove(CSS_CLASSES.MOTION_CLOSING);
          this.disconnectObserver();

          if (this._drawerCloseResolver) {
            this._drawerCloseResolver();
            this._drawerCloseResolver = null;
          }
        }.bind(this),
        MOTION_DURATION
      );
    }
  }

  disconnectObserver() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }

  connectedCallback() {
    this.setUpMutationObserver();
  }

  disconnectedCallback() {
    this.disconnectObserver();
  }
}
