import React from 'react';

const Slider = ({ defaultValue, id, index, type, onChange, min, max, label, ...rest }) => {
    return (
        <>
            <label htmlFor={`delay-${type}-${index}`}>{label}</label>
            <input
                type="range"
                min={min || 0}
                max={max || 1}
                step={0.1}
                defaultValue={defaultValue || 0}
                onChange={onChange}
                id={id}
                {...rest}
            />
        </>
    )
}

export default Slider;