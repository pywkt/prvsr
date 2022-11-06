import React from 'react';

/**
 * 
 * @param {number} index The index of the part this component controls. For drums this can be any number.
 * @param {object} data The whole RHF data object for the instrument/part this component controls.
 * @returns A React component (HTML slider) that controls the volume for the instrument/part 
 * this component is in.
 */

const VolumeControl = ({ index, data }) => {
    console.log("drum data:", data)
    const handleChannel = (e) => {
        if (!data.channel) {
            console.log("no channel")
            return null
        }

        data.channel.volume.value = Number(e.target.value)
    }

    return (
        <input
            type="range"
            min="-100"
            max="50"
            step={0.5}
            defaultValue="-20"
            onChange={handleChannel}
            id={`volume-${index}`}
        />
    )
}

export default VolumeControl;