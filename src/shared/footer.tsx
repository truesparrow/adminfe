import * as React from 'react'
import { Link } from 'react-router-dom'

import * as config from './config'

import * as text from './footer.text'

export function Footer() {
    return (
        <footer className="footer">
            <p className="company-links">
                <Link to="/company/about">{text.about[config.LANG()]}</Link>
                <Link to="/company/tos">{text.terms[config.LANG()]}</Link>
                <Link to="/company/privacy">{text.privacy[config.LANG()]}</Link>
                <Link to="/company/cookies">{text.cookies[config.LANG()]}</Link>
                <Link to="/company/contact">{text.contact[config.LANG()]}</Link>
            </p>
            <p className="copyright">
                <span>{text.copyright[config.LANG()]}</span>
            </p>
        </footer>
    );
}
