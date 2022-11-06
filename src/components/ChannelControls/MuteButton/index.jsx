import React from 'react';

/**
 * 
 * @param {number} index The index of the part this component controls. For drums this can be any number.
 * @param {object} data The whole RHF data object for the instrument/part this component controls.
 * @returns A React component (HTML checkbox) that toggles the sound on and off for the instrument this
 * component is a child of.
 */

const MuteButton = ({ index, data }) => {
    const toggleMute = (e) => data.channel.mute = e.target.checked

    return (
        <input
            type="checkbox"
            defaultChecked={false}
            id={`mute-${index}`}
            onChange={toggleMute}
        />
    )
}

export default MuteButton;