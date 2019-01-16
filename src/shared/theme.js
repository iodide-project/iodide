const THEME = {};

THEME.header = {};
THEME.header.left = {};
THEME.header.middle = {};
THEME.header.right = {};

THEME.header.height = "55px";

// THEME.HEADER.left - left container properties.
THEME.header.left.leftMargin = "20px";
THEME.header.right.rightMargin = "20px";

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

export default THEME;
