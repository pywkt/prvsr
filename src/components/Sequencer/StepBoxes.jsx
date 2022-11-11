import React from 'react';
import styles from '../../styles/StepBoxes.module.scss';

const StepBoxes = ({ drumSteps, selectedKit, handleKickChange, register }) => {

    const makeTrackBoxes = (track) => {
        return Array.from(Array(drumSteps)).map((_, i) =>
            <input {...register(`${track}`)} onChange={() => handleKickChange(i, track)} key={`${track}-${i}`} type="checkbox" id={`${track}-step-${i}`} />)
    }

    return (
        <div className={styles.stepBoxContainer}>
            {selectedKit.parts.map((ad, ind) => (
                <div key={ad} className={styles.steps}>
                    {makeTrackBoxes(ad)} <span className={styles.stepTrackLabel}>{ad}</span>
                </div>
            ))}
        </div>
    )
}

export default StepBoxes;