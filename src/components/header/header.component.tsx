import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/Logo.png';
import './header.styles.scss';
import ThemeSelector from '../ThemeSelector/ThemeSelector';

const Header = () => {
  return (
    <div className="headerContainer">
      <div className="header-left">
        <Link to="/">
          <img src={Logo} alt="Logo" />
        </Link>
        <p>Thirukkural - Learn</p>
      </div>
      <div className="header-right">
        <ThemeSelector />
      </div>
    </div>
  );
};

export default Header;
