import React from 'react';

/**
 * 
 * @param {number} index The index of the part this component controls. For drums this can be any number.
 * @param {object} data The whole RHF data object for the instrument/part this component controls.
 * @returns A React component (HTML checkbox) that mutes all other instruments except the instrument this
 * component is a child of.
 */

const SoloButton = ({ index, data }) => {
    const toggleSolo = (e) => data.channel.solo = e.target.checked

    return (
        <input
            type="checkbox"
            defaultChecked={false}
            id={`solo-${index}`}
            onChange={toggleSolo}
        />
    )
}

export default SoloButton;