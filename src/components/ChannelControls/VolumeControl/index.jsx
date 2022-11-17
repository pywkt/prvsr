import React from 'react';
// import styles from '../../../styles/SequencerControls.module.scss';

/**
 * 
 * @param {number} index The index of the part this component controls. For drums this can be any number.
 * @param {object} data The whole RHF data object for the instrument/part this component controls.
 * @param {string} orientation Whether or not the slider is `horizontal` or `vertical`.
 * @returns A React component (HTML slider) that controls the volume for the instrument/part 
 * this component is in.
 */

const VolumeControl = ({ index, data, drums }) => {
    const handleChannel = (e) => {
        if (!data.channel) {
            console.log("no channel")
            return null
        }

        data.channel.volume.value = Number(e.target.value)
    }

    return (
        <div>
            <label htmlFor={drums ? `volume-${index}-drums` : `volume-${index}`}>Volume</label>
            <input
                type="range"
                min="-150"
                max="30"
                step={0.5}
                defaultValue="-30"
                onChange={handleChannel}
                id={drums ? `volume-${index}-drums` : `volume-${index}`}
                // className={styles.drumVolumeSlider}
                // className={`${styles.volumeSlider} ${orientation === "vertical" && styles.verticalSlider}`}
            />
        </div>
            
    )
}

export default VolumeControl;