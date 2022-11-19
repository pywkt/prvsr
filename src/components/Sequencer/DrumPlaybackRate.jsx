import React from 'react';
import styles from '../../styles/SequencerControls.module.scss';

const DrumPlaybackRate = ({ rateCallback }) => {
    return (
        <div>
            <label htmlFor='drum-playback-rate'>Playback Rate</label>
            <input className={styles.numberOfStepsInput} type="number" id="drum-playback-rate" onChange={(e) => rateCallback(e.target.value)} defaultValue={2} />
            {/* <Button onClick={() => changeDrumSteps(drumStepsRef.current)} label="Update" /> */}
        </div>
    )
}

export default DrumPlaybackRate;