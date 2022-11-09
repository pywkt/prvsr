import React from 'react';

const Button = ({ label, onClick, ...rest }) => {
    return (
        <button onClick={onClick} {...rest}>{label}</button>
    )
}

export default Button;