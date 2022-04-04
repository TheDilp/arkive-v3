import React from "react";

export default class MarkerTool {
  static get isInline() {
    return true;
  }

  constructor() {
    // @ts-ignore
    this.button = null;
    // @ts-ignore
    this.state = false;
  }
  render() {
    // @ts-ignore
    this.button = document.createElement("button");
    // @ts-ignore
    this.button.type = "button";
    // @ts-ignore
    this.button.textContent = "M";
    // @ts-ignore
    return this.button;
  }

  surround(range: any) {}

  checkState(selection: any) {}
}
