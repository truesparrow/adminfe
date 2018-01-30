import { expect } from 'chai'
import * as Enzyme from 'enzyme'
import { shallow } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import * as React from 'react'
import 'mocha'

import { AdminAccountPage } from './admin-account-page'
import * as config from './config'


Enzyme.configure({adapter: new Adapter()});

describe('AdminAccountPage', () => {
    before('set LANG', () => {
        (config as any).LANG = () => 'en'; // Not nice
    });

    it('should render', () => {
        const wrapper = shallow(<AdminAccountPage />);
        expect(wrapper.contains('Account page')).to.be.true;
    });
});
