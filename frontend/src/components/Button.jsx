import React from 'react';
import styles from './Button.module.css';

// eslint-disable-next-line react/prop-types
const Button = ({ onClick, children, variant = 'primary' }) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
