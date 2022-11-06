import React from 'react';

const VolumeControl = ({ index, data }) => {
    const handleChannel = (e, i) => {
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
            max="30"
            step={0.5}
            defaultValue="-20"
            onChange={(e) => handleChannel(e, index)}
            id={`volume-${index}`}
        />
    )
}

export default VolumeControl;