# LWC Drawer

![NPM Version](https://img.shields.io/npm/v/@wisefoxme/drawer-lwc?style=flat-square) ![License](https://img.shields.io/github/license/wisefoxme/drawer-lwc) ![Downloads](https://img.shields.io/npm/dy/%40wisefoxme%2Fdrawer-lwc)

A customizable drawer component for Lightning Experience that creates a full-viewport overlay with a configurable sidebar. This component allows developers to build their own drawer content while providing a consistent overlay experience that integrates seamlessly with the Lightning design system.

![Drawer Preview](assets/drawer.gif)

## Features

- Full viewport overlay
- Customizable sidebar content
- Lightning Experience integration
- Responsive design
- Accessible implementation

## Usage

Import and use the drawer component in your Lightning Web Components to create slide-out panels for navigation, forms, or any custom content that requires a focused user experience.

The component takes advantage of the slots feature, allowing you to insert any custom content inside the drawer.

```html
<!-- this sample component implements the drawer -->
<template>
  <div class="slds-box slds-theme_default">
    <c-drawer>
      <!-- the drawer content goes here -->
      <!-- this is what is rendered inside the drawer -->
    </c-drawer>
    <!-- use something to call the drawer's .open
      method, such as a button -->
    <lightning-button
      label="Open the drawer"
      onclick="{openDrawer}"
    ></lightning-button>
  </div>
</template>
```
