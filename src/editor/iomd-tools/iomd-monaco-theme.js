export const iomdTheme = {
  base: "vs", // can also be vs-dark or hc-black
  inherit: true, // can also be false to completely replace the builtin rules
  rules: [
    { token: "iomd-type", foreground: "343434", fontStyle: "bold" },
    { token: "iomd-flag", foreground: "787878", fontStyle: "italic" },
    { token: "string.fetch-url", fontStyle: "italic" }
  ],
  colors: {
    "editor.lineHighlightBackground": "#00000018"
  }
};
