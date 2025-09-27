import React from 'react';

import {
    Link
  } from "react-router-dom";



function Menu() {
  return (
    <nav
        role="navigation"
        aria-label="Main menu"
        itemScope
        itemType="http://schema.org/SiteNavigationElement"
    >
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>
    </nav>
  );
}

export default Menu;
