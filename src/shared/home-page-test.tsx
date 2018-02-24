import { expect } from 'chai'
import * as Enzyme from 'enzyme'
import { /*mount, */shallow } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import * as React from 'react'
// import { MemoryRouter } from 'react-router-dom'
import 'mocha'

import * as config from './config'
import { Features, /* HomePage, */ Pricing } from './home-page'


Enzyme.configure({ adapter: new Adapter() });

describe('Hero', () => {
    before('set LANG', () => {
        (config as any).LANG = () => 'en'; // Not nice
    });

    it('should render', () => {
        // const wrapper = shallow(<Hero />);
        // expect(wrapper.contains('Wedding Websites')).to.be.true;
    });
});

describe('Features', () => {
    before('set LANG', () => {
        (config as any).LANG = () => 'en'; // Not nice
    });

    it('should render', () => {
        const wrapper = shallow(<Features />);
        expect(wrapper.contains('Features')).to.be.true;
    });
});

describe('Pricing', () => {
    before('set LANG', () => {
        (config as any).LANG = () => 'en'; // Not nice
    });

    it('should render', () => {
        const wrapper = shallow(<Pricing />);
        expect(wrapper.contains('Pricing')).to.be.true;
    });
});

describe('HomePage', () => {
    before('set LANG', () => {
        (config as any).LANG = () => 'en'; // Not nice
    });

    it('should render', () => {
        // const wrapper = mount(<MemoryRouter><HomePage /></MemoryRouter>);
        // expect(wrapper.contains('Features')).to.be.true;
    });
});
