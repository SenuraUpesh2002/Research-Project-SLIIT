import React from 'react';
import styles from './FormInput.module.css';

// eslint-disable-next-line react/prop-types
const FormInput = ({ label, type = 'text', name, value, onChange, error, ...rest }) => {
  return (
    <div className={styles.formGroup}>
      {label && <label htmlFor={name} className={styles.label}>{label}</label>}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        {...rest}
      />
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export default FormInput;
