import React from 'react';
import styles from '../../styles/Button.module.scss';

const Button = ({ label, onClick, ...rest }) => {
    return (
        <button className={styles.button} onClick={onClick} {...rest}>{label}</button>
    )
}

export default Button;