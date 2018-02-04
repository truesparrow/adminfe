import { expect } from 'chai'
import * as Enzyme from 'enzyme'
import { shallow } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import * as React from 'react'
import 'mocha'

import { AdminEventPage } from './admin-event-page'
import * as config from './config'


Enzyme.configure({ adapter: new Adapter() });

describe('AdminEventPage', () => {
    before('set LANG', () => {
        (config as any).LANG = () => 'en'; // Not nice
    });

    it('should render', () => {
        const wrapper = shallow(<AdminEventPage />);
        expect(wrapper.contains('Fill out details about your event here')).to.be.true;
    });
});
