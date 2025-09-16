import { createElement } from "@lwc/engine-dom";
import Drawer from "c/drawer";

const SELECTORS = {
  BACKDROP: '[data-id="backdrop"]',
  CLOSE_BUTTON: '[data-id="close-button"]',
  DRAWER: '[data-id="drawer"]',
  NAVSECTION: 'slot[name="navigationSection"]'
};

describe("c-drawer", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  describe("rendering", () => {
    it("renders when isDrawerOpen is true", () => {
      // Arrange
      const element = createElement("c-drawer", {
        is: Drawer
      });
      element.isDrawerOpen = true;

      // Act
      document.body.appendChild(element);

      // Assert
      const div = element.shadowRoot.querySelector(SELECTORS.DRAWER);
      expect(div).not.toBeNull();

      const slot = element.shadowRoot.querySelector(SELECTORS.NAVSECTION);
      expect(slot).not.toBeNull();
    });

    it("does not render when isDrawerOpen is false", () => {
      // Arrange
      const element = createElement("c-drawer", {
        is: Drawer
      });
      element.isDrawerOpen = false;

      // Act
      document.body.appendChild(element);

      // Assert
      const div = element.shadowRoot.querySelector(SELECTORS.DRAWER);
      expect(div).toBeNull();
    });
  });

  describe("opening behavior", () => {
    it("opens the drawer when open() is called", async () => {
      jest.useFakeTimers();

      // Arrange
      const element = createElement("c-drawer", {
        is: Drawer
      });
      document.body.appendChild(element);

      const handler = jest.fn();
      element.addEventListener("draweropen", handler);

      // Act
      element.open();
      await Promise.resolve();

      // Assert
      const div = element.shadowRoot.querySelector(SELECTORS.DRAWER);
      expect(div).not.toBeNull();

      // Asserts that the event was dispatched
      expect(handler).toHaveBeenCalled();

      // After animation ends, the drawer should still be in the DOM
      jest.runAllTimers();
      await Promise.resolve();

      const divAfterAnimation = element.shadowRoot.querySelector(
        SELECTORS.DRAWER
      );

      expect(divAfterAnimation).not.toBeNull();
    });
  });

  describe("closing behavior", () => {
    let element;
    const openHandler = jest.fn();
    const closeHandler = jest.fn();

    beforeEach(() => {
      jest.useFakeTimers();

      // Arrange
      element = createElement("c-drawer", {
        is: Drawer
      });
      document.body.appendChild(element);

      element.addEventListener("draweropen", openHandler);
      element.addEventListener("drawerclose", closeHandler);

      // Open the drawer before each test
      element.open();

      jest.runAllTimers();
    });

    it("closes the drawer when the close button is clicked", async () => {
      // Act
      const closeButton = element.shadowRoot.querySelector(
        SELECTORS.CLOSE_BUTTON
      );
      closeButton.click();

      await Promise.resolve();

      // Assert
      const div = element.shadowRoot.querySelector(SELECTORS.DRAWER);
      expect(div).not.toBeNull(); // Drawer is still in DOM until animation ends

      // Asserts that the event was dispatched
      expect(openHandler).toHaveBeenCalled();

      jest.runAllTimers();

      // After animation ends, the drawer should be removed from the DOM
      await Promise.resolve();
      const divAfterAnimation = element.shadowRoot.querySelector(
        SELECTORS.DRAWER
      );
      expect(divAfterAnimation).toBeNull();
    });

    it("closes the drawer when the backdrop is clicked", async () => {
      // Act
      const backdrop = element.shadowRoot.querySelector(SELECTORS.BACKDROP);
      backdrop.click();

      await Promise.resolve();

      // Assert
      const div = element.shadowRoot.querySelector(SELECTORS.DRAWER);
      expect(div).not.toBeNull(); // Drawer is still in DOM until animation ends

      // Asserts that the event was dispatched
      expect(closeHandler).toHaveBeenCalled();

      jest.runAllTimers();

      // After animation ends, the drawer should be removed from the DOM
      await Promise.resolve();
      const divAfterAnimation = element.shadowRoot.querySelector(
        SELECTORS.DRAWER
      );
      expect(divAfterAnimation).toBeNull();
    });
  });
});
