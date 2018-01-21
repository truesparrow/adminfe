import { expect } from 'chai'
import * as Enzyme from 'enzyme'
import { shallow } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import * as React from 'react'
import 'mocha'

import * as config from './config'
import { Header } from './header'


Enzyme.configure({adapter: new Adapter()});

describe('Header', () => {
    before('set LANG', () => {
        (config as any).LANG = () => 'en'; // Not nice
    });

    it('should render', () => {
        const wrapper = shallow(<Header />);
        expect(wrapper.contains('Header')).to.be.true;
    });
});
