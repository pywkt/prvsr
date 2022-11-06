import React from 'react';

const SoloButton = ({ index, data }) => {
    const toggleSolo = (e) => data.channel.solo = e.target.checked

    return (
        <input
            type="checkbox"
            defaultChecked={false}
            id={`solo-${index}`}
            onChange={(e) => toggleSolo(e, index)}
        />
    )
}

export default SoloButton;