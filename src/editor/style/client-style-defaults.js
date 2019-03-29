import { injectGlobal } from "emotion";
import THEME from "../../shared/theme";

export default injectGlobal`
html, body {
    font-family: ${THEME.mainFontFamily};
}
`;
