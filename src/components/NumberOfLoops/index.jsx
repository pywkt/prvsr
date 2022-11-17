import React from 'react';

const NumberOfLoops = ({ index, register }) => {
    return (
        <div>
            <span htmlFor={`number-of-loops-${index}`}>Number of loops to make</span>
            <input defaultValue={4} type="number" id={`number-of-loops-${index}`} {...register(`instrumentArray.${index}.numberOfLoops`)} />
        </div>
    )
}

export default NumberOfLoops;