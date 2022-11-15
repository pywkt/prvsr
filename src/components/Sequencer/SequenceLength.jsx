import React, { useRef } from 'react';
import Button from '../Button';
import styles from '../../styles/SequencerControls.module.scss';

const SequenceLength = ({ changeDrumSteps }) => {
    const drumStepsRef = useRef(16)
    return (
        <div>
            <label htmlFor='sequencer-step-amount'>Number of Steps</label>
            <input className={styles.numberOfStepsInput} type="number" id="sequencer-step-amount" onBlur={(e) => changeDrumSteps(e.target.value)} defaultValue={16} />
            {/* <Button onClick={() => changeDrumSteps(drumStepsRef.current)} label="Update" /> */}
        </div>
    )
}

export default SequenceLength;