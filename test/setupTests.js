import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import './message-channel-stub'

global.IODIDE_EDITOR_ORIGIN = 'http://localhost'

Enzyme.configure({ adapter: new Adapter() })
