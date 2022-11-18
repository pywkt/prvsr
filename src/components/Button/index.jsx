import React from 'react';
import styles from '../../styles/Button.module.scss';

const Button = ({ label, onClick, customClass, ...rest }) => {
    return (
        <button className={`${styles.button} ${customClass}`} onClick={onClick} {...rest}>{label}</button>
    )
}

export default Button;