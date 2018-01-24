import { expect } from 'chai'
import * as Enzyme from 'enzyme'
import { mount } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import * as React from 'react'
import 'mocha'

import * as config from './config'
import { HomePage, Pricing } from './home'


Enzyme.configure({adapter: new Adapter()});

describe('Pricing', () => {
    before('set LANG', () => {
        (config as any).LANG = () => 'en'; // Not nice
    });

    it('should render', () => {
        const wrapper = mount(<Pricing />);
        expect(wrapper.contains('Pricing')).to.be.true;
    });
});

describe('HomePage', () => {
    before('set LANG', () => {
        (config as any).LANG = () => 'en'; // Not nice
    });

    it('should render', () => {
        const wrapper = mount(<HomePage />);
        expect(wrapper.contains('Home page')).to.be.true;
    });
});
