import React from 'react';
import styles from '../../styles/SequencerControls.module.scss';

const SequenceLength = ({ changeDrumSteps }) => {
    return (
        <div>
            <label htmlFor='sequencer-step-amount'>Number of Steps</label>
            <input className={styles.numberOfStepsInput} type="number" id="sequencer-step-amount" onBlur={(e) => changeDrumSteps(e.target.value)} defaultValue={16} />
        </div>
    )
}

export default SequenceLength;