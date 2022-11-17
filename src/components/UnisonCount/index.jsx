import React from 'react';

const UnisonCount = ({ index, register }) => {

    return (
        <div>
            <label htmlFor='unison-count'>Notes to play in unison</label>
            <input defaultValue="1" type="number" id='unison-count' {...register(`instrumentArray.${index}.unisonCount`)} />
        </div>
    )
}

export default UnisonCount