import React from 'react';

const NumberOfBars = ({ index, register }) => {
    return (
        <div>
            <label htmlFor={`number-of-bars-${index}`}>Number of bars to make</label>
            <input defaultValue={4} type="number" id={`number-of-bars-${index}`} {...register(`instrumentArray.${index}.maxBars`)} />
        </div>
    )
}

export default NumberOfBars;