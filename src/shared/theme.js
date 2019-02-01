const THEME = {};

THEME.mainFontFamily = `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";`;

THEME.client = {};
THEME.client.pane = {};
THEME.client.pane.backgroundColor = "white";
THEME.client.pane.defaultTextColor = "black";

THEME.logo = {};
THEME.logo.darkColor = "#4f3554";

THEME.header = {};
THEME.header.left = {};
THEME.header.middle = {};
THEME.header.right = {};

THEME.header.height = "48px";
THEME.header.defaultSpacing = "12px";
// NB: the slight margin-bottom is there to accomodate the notebook pane margin size,
// which Golden Layout sets to 5px.
THEME.header.bottomMargin = "0px";

// THEME.HEADER.left - left container properties.
THEME.header.left.leftMargin = "20px";
THEME.header.right.rightMargin = "20px";
THEME.header.left.minWidth = "300px";
THEME.header.right.minWidth = THEME.header.left.minWidth;

// sets the header background on both the notebook itself and the server bar.
THEME.header.backgroundLeft = "#3f1b47";
THEME.header.backgroundRight = "#1e0f21";
THEME.header.background = `linear-gradient(to right, ${
  THEME.header.backgroundLeft
}, ${THEME.header.backgroundRight})`;

// elementBackground is the background css property for
// various contained elements such as featured notebooks.
THEME.elementBackgroundLeft = "rgb(248, 243, 248)";
THEME.elementBackgroundRight = "rgb(250, 248, 250)";
THEME.elementBackground = `linear-gradient(to right, ${
  THEME.elementBackgroundLeft
}, ${THEME.elementBackgroundRight})`;

THEME.clientModal = {};
THEME.clientModal.backgroundLeft = "#301934";
THEME.clientModal.backgroundRight = "#563C5C";
THEME.clientModal.background = `linear-gradient(to left, ${
  THEME.clientModal.backgroundLeft
}, ${THEME.clientModal.backgroundRight})`;

// BUTTON COLORS
THEME.button = {};
THEME.button.baseColor = THEME.clientModal.backgroundRight;
THEME.button.hoverColor = THEME.clientModal.backgroundLeft;

export default THEME;
