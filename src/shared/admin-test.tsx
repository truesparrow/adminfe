import { expect } from 'chai'
import * as Enzyme from 'enzyme'
import { shallow } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import * as React from 'react'
import 'mocha'

import { AdminPage } from './admin'
import * as config from './config'


Enzyme.configure({adapter: new Adapter()});

describe('AdminPage', () => {
    before('set LANG', () => {
        (config as any).LANG = () => 'en'; // Not nice
    });

    it('should render', () => {
        const wrapper = shallow(<AdminPage />);
        expect(wrapper.contains('Admin page')).to.be.true;
    });
});
