import { injectGlobal } from 'emotion'
import ZILLA_SLAB from './ZillaSlab-Light.woff'

export default injectGlobal`
@font-face {
  font-family: 'Zilla Slab';
  src: url("/${ZILLA_SLAB}");
}
`
