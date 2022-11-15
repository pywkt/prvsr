import React from 'react';
import styles from '../../styles/SequencerControls.module.scss'

const StartTime = ({ setBar, setBeat, register }) => {

    return (
        <div>
            <span>Start Time:</span>
            <div>
                <input className={styles.drumStartTimeInput} defaultValue={0} type="number" id="start-time-bar-drums" {...register(`drums.startTime.bar`)} />
                <span>:</span>
                <input className={styles.drumStartTimeInput} defaultValue={0} type="number" id="start-time-bar-drums" {...register(`drums.startTime.beat`)} />

            </div>

        </div>
    )
}

export default StartTime;