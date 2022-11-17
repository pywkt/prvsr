import React from 'react';

const StartTime = ({ index, register }) => {
    return (
        <div>
            <label htmlFor='start-time-bar-input'>Start Time</label>
            <div>
                <input defaultValue={0} type="number" id="start-time-bar-input" {...register(`instrumentArray.${index}.startTime.bar`)} />
                <span>:</span>
                <input defaultValue={0} type="number" id="start-time-beat-input" {...register(`instrumentArray.${index}.startTime.beat`)} />
            </div>
        </div>
    )
}

export default StartTime;