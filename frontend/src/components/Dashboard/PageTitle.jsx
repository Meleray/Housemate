import React from 'react';
import './PageTitle.css';

function PageTitle({ children, ...rest }) {
  return (
    <p className="pageTitle" {...rest}>
      {children}
    </p>
  );
}

export default PageTitle;