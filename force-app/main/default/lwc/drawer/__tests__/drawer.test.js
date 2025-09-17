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

    describe("should render the sizes correctly based on drawerSize property", () => {
      it("size 1", () => {
        const element = createElement("c-drawer", {
          is: Drawer
        });
        element.isDrawerOpen = true;
        element.drawerSize = 1;

        document.body.appendChild(element);

        const div = element.shadowRoot.querySelector(SELECTORS.DRAWER);
        expect(div.className).toContain("slds-size_1-of-12");
      });

      it("size 2", () => {
        const element = createElement("c-drawer", {
          is: Drawer
        });
        element.isDrawerOpen = true;
        element.drawerSize = 2;

        document.body.appendChild(element);

        const div = element.shadowRoot.querySelector(SELECTORS.DRAWER);
        expect(div.className).toContain("slds-size_2-of-12");
      });

      it("size 6", () => {
        const element = createElement("c-drawer", {
          is: Drawer
        });
        element.isDrawerOpen = true;
        element.drawerSize = 6;

        document.body.appendChild(element);

        const div = element.shadowRoot.querySelector(SELECTORS.DRAWER);
        expect(div.className).toContain("slds-size_6-of-12");
      });

      it("size 12", () => {
        const element = createElement("c-drawer", {
          is: Drawer
        });
        element.isDrawerOpen = true;
        element.drawerSize = 12;

        document.body.appendChild(element);

        const div = element.shadowRoot.querySelector(SELECTORS.DRAWER);
        expect(div.className).toContain("slds-size_12-of-12");
      });

      it("invalid size (e.g., 0) defaults to size 2", () => {
        const element = createElement("c-drawer", {
          is: Drawer
        });
        element.isDrawerOpen = true;
        element.drawerSize = 0;

        document.body.appendChild(element);

        const div = element.shadowRoot.querySelector(SELECTORS.DRAWER);
        expect(div.className).toContain("slds-size_2-of-12");
      });

      it("invalid size (e.g., 13) defaults to size 2", () => {
        const element = createElement("c-drawer", {
          is: Drawer
        });
        element.isDrawerOpen = true;
        element.drawerSize = 13;

        document.body.appendChild(element);

        const div = element.shadowRoot.querySelector(SELECTORS.DRAWER);
        expect(div.className).toContain("slds-size_2-of-12");
      });

      it("invalid size (e.g., 'abc') defaults to size 2", () => {
        const element = createElement("c-drawer", {
          is: Drawer
        });
        element.isDrawerOpen = true;
        element.drawerSize = "abc";

        document.body.appendChild(element);

        const div = element.shadowRoot.querySelector(SELECTORS.DRAWER);
        expect(div.className).toContain("slds-size_2-of-12");
      });
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
    let openPromise;

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
      openPromise = element.open();

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

    it("closes the drawer when the .close() method is called", async () => {
      // Act
      element.close();

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

    it("closes the drawer when the ESC key is pressed", async () => {
      // Act: simulate ESC key press
      const escEvent = new KeyboardEvent("keydown", {
        key: "Escape"
      });
      element.shadowRoot.dispatchEvent(escEvent);

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

    it("resolves the open promise when the close button is clicked", async () => {
      // Act: close the drawer
      const closeButton = element.shadowRoot.querySelector(
        SELECTORS.CLOSE_BUTTON
      );
      closeButton.click();

      await Promise.resolve();
      jest.runAllTimers();

      // Asserts that the event was dispatched
      expect(closeHandler).toHaveBeenCalled();

      // Assert: promise resolves
      await expect(openPromise).resolves.toBeUndefined();
    });
  });
});
