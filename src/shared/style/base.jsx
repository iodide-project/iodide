import { injectGlobal } from 'emotion'
import ZillaSlab from './ZillaSlab-Light.woff'

export default injectGlobal`
@font-face {
  font-family: 'Zilla Slab';
  src: url("/${ZillaSlab}");
}
`
