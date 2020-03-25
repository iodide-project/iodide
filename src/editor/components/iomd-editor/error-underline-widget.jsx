import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

export const errorUnderlineWidget = {
  domNode: null,
  position: null,
  getId() {
    return "errorUnderlineWidget";
  },
  getDomNode() {
    if (!this.domNode) {
      this.domNode = document.createElement("div");
      this.domNode.innerHTML = "﹏";
      this.domNode.style.color = "red";
      this.domNode.style.width = "1.3ch";
      this.domNode.style.marginLeft = "-.15ch";
      this.domNode.style.marginTop = ".1em";
      this.domNode.style.overflow = "hidden";
      this.domNode.style.fontWeight = "bold";
    }
    return this.domNode;
  },
  getPosition() {
    return {
      position: this.position,
      preference: [monaco.editor.ContentWidgetPositionPreference.EXACT]
    };
  },
  setPosition(lineNumber, column) {
    this.position = { lineNumber, column };
  }
};
