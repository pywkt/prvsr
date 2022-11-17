import React from 'react';

const ProbabilityAmount = ({ index, register }) => {
    return (
        <div>
            <label htmlFor={`probability-${index}`}>Probability</label>
            <input defaultValue={1} type="number" min={0} max={1} step={0.1} id={`probability-${index}`} {...register(`instrumentArray.${index}.probability`)} />
        </div>
    )
}

export default ProbabilityAmount;