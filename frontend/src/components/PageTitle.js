import React from 'react';
import './styles.PageTitle.css';

function PageTitle({ children, ...rest }) {
  return (
    <p className="pageTitle" {...rest}>
      {children}
    </p>
  );
}

export default PageTitle;
