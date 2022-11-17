import React from 'react';

const Octave = ({ index, register }) => {
    return (
        <div>
            <label htmlFor='octave-input'>Octave</label>
            <input defaultValue={3} type="number" id="octave-input" {...register(`instrumentArray.${index}.octave`)} />
        </div>
    )
}

export default Octave;