import React from 'react';

const MuteButton = ({ index, data }) => {
    const toggleMute = (e) => data.channel.mute = e.target.checked

    return (
        <input
            type="checkbox"
            defaultChecked={false}
            id={`mute-${index}`}
            onChange={(e) => toggleMute(e, index)}
        />
    )
}

export default MuteButton;