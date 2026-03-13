import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { nav } from '../constants';
import './nav.styles.scss';
import { getIcon } from './navUtils';

interface NavProps {
  location: any;
}



const Nav = (props: NavProps) => {
  const { location } = props;
  const [menu, updateMenu] = useState([...nav]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  useEffect(() => {
    const { pathname } = location;
    const newMenu = nav.map((item: any) => ({
      ...item,
      isClicked: item.link.toLowerCase() === pathname.toLowerCase(),
    }));
    updateMenu(newMenu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, item: any) => {
    const newMenu = menu.map((menuItem: any) => ({
      ...menuItem,
      isClicked: menuItem.text === item.text,
    }));
    updateMenu(newMenu);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        {/* Mobile menu button */}
        <button
          className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation menu */}
        <ul className={`menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {menu.map((item, index) => {
            return (
              <li className={`item ${item.isClicked ? 'active' : ''}`} key={index}>
                <Link to={item.link} onClick={(e) => handleClick(e, item)} className="nav-link">
                  <span className="nav-icon">{getIcon(item.text)}</span>
                  <span className="nav-text">{item.text}</span>
                  <span className="nav-indicator"></span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
