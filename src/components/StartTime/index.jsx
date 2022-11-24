import React from 'react';
import styles from '../../styles/globals.module.scss'

const StartTime = ({ currentTime, index, register, setValue }) => {
    const setNewTime = () => {
        // const updatedTime = Number(currentTime.split(':')[0]) + 4
        const updatedTime = Number(currentTime.split(':')[0])
        setValue(`instrumentArray.${index}.startTime.bar`, updatedTime)
    }
    return (
        <div>
            <label htmlFor='start-time-bar-input' style={{ flexGrow: 0.8 }}>Start Time</label>
            <button className={styles.simpleButton} type="button" onClick={setNewTime}>now</button>
            <div>
                <input defaultValue={0} type="number" id="start-time-bar-input" {...register(`instrumentArray.${index}.startTime.bar`)} />
                <span>:</span>
                <input defaultValue={0} type="number" id="start-time-beat-input" {...register(`instrumentArray.${index}.startTime.beat`)} />
            </div>
        </div>
    )
}

export default StartTime;