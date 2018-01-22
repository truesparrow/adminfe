import { expect } from 'chai'
import * as Enzyme from 'enzyme'
import { shallow } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import * as React from 'react'
import 'mocha'

import * as config from './config'
import { Footer } from './footer'


Enzyme.configure({adapter: new Adapter()});

describe('Footer', () => {
    before('set LANG', () => {
        (config as any).LANG = () => 'en'; // Not nice
    });

    it('should render', () => {
        const wrapper = shallow(<Footer />);
        expect(wrapper.contains(<span>Copyright © 2018</span>)).to.be.true;
    });
});
