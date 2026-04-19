import React, { useEffect, useRef, useState } from 'react';
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const { pathname } = location;
    const newMenu = nav.map((item: any) => {
      if (item.children) {
        const childActive = item.children.some(
          (c: any) => c.link.toLowerCase() === pathname.toLowerCase()
        );
        return { ...item, isClicked: childActive };
      }
      return { ...item, isClicked: item.link.toLowerCase() === pathname.toLowerCase() };
    });
    updateMenu(newMenu);
    setOpenDropdown(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleClick = (_e: React.MouseEvent<HTMLAnchorElement>, item: any) => {
    const newMenu = menu.map((menuItem: any) => ({
      ...menuItem,
      isClicked: menuItem.text === item.text,
    }));
    updateMenu(newMenu);
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = (text: string) => {
    setOpenDropdown(prev => (prev === text ? null : text));
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
        <ul ref={dropdownRef} className={`menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {menu.map((item, index) => {
            if (item.children) {
              const isOpen = openDropdown === item.text;
              return (
                <li className={`item has-dropdown ${item.isClicked ? 'active' : ''} ${isOpen ? 'dropdown-open' : ''}`} key={index}>
                  <button
                    className="nav-link nav-dropdown-toggle"
                    onClick={() => toggleDropdown(item.text)}
                    aria-expanded={isOpen}
                  >
                    <span className="nav-icon">{getIcon(item.text)}</span>
                    <span className="nav-text">{item.text}</span>
                    <span className="nav-chevron">{isOpen ? '▲' : '▼'}</span>
                    <span className="nav-indicator"></span>
                  </button>
                  <ul className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
                    {item.children.map((child: any, ci: number) => (
                      <li key={ci} className="dropdown-item">
                        <Link to={child.link} onClick={(e) => handleClick(e, child)} className="dropdown-link">
                          <span className="nav-icon">{getIcon(child.text)}</span>
                          <span className="nav-text">{child.text}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            }
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
