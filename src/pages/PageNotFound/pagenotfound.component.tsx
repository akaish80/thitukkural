import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <>
    <h1 style={{ marginTop: 0 }}>404 - Not Found!</h1>
    <Link to="/">Go Home</Link>
  </>
);

export default NotFound;
