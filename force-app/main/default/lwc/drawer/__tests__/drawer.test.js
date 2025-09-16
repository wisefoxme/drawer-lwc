import { createElement } from "@lwc/engine-dom";
import Drawer from "c/drawer";

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
      const div = element.shadowRoot.querySelector("div[data-id='drawer']");
      expect(div).not.toBeNull();

      const slot = element.shadowRoot.querySelector(
        'slot[name="navigationSection"]'
      );
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
      const div = element.shadowRoot.querySelector("div[data-id='drawer']");
      expect(div).toBeNull();
    });
  });
});
