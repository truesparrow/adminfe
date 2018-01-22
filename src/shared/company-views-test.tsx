import { expect } from 'chai'
import * as Enzyme from 'enzyme'
import { mount } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import * as React from 'react'
import 'mocha'

import * as config from './config'
import {
    CompanyAboutView,
    CompanyTermsView,
    CompanyPrivacyView,
    CompanyCookiesView
} from './company-views'


Enzyme.configure({adapter: new Adapter()});

describe('CompanyAboutView', () => {
    before('set LANG', () => {
        (config as any).LANG = () => 'en'; // Not nice
    });

    it('should render', () => {
        const wrapper = mount(<CompanyAboutView />);
        expect(wrapper.contains('about')).to.be.true;
    });
});

/* describe('CompanyTermsView', () => {
 *     before('set LANG', () => {
 *         (config as any).LANG = () => 'en'; // Not nice
 *     });
 * 
 *     it('should render', () => {
 *         const wrapper = mount(<CompanyTermsView />);
 *         expect(wrapper.contains(<p>This is the <em>terms and conditions</em></p>)).to.be.true;
 *     });
 * });*/

describe('CompanyPrivacyView', () => {
    before('set LANG', () => {
        (config as any).LANG = () => 'en'; // Not nice
    });

    it('should render', () => {
        const wrapper = mount(<CompanyPrivacyView />);
        expect(wrapper.contains('privacy')).to.be.true;
    });
});

describe('CompanyCookiesView', () => {
    before('set LANG', () => {
        (config as any).LANG = () => 'en'; // Not nice
    });

    it('should render', () => {
        const wrapper = mount(<CompanyCookiesView />);
        expect(wrapper.contains('cookies')).to.be.true;
    });
});
