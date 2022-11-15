import React from 'react';
import { allDrumKits } from '../../instruments/drums';
import styles from '../../styles/SequencerControls.module.scss';

const KitSelector = ({ setSelectedKit }) => {

    const handleSelection = (e) => {
        setSelectedKit(allDrumKits[e.target.value])
    }

    return (
        <div>
            <label htmlFor='kit-selector'>Kit</label>
            <select id="kit-selector" onChange={handleSelection} className={styles.selectorDropdown}>
                {allDrumKits.map((item, index) => (
                    <option value={index} key={`${item.name}-${index}`} label={item.name} />
                ))}
            </select>
        </div>

    )
}

export default KitSelector;