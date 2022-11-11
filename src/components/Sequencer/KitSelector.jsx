import React from 'react';
import { allDrumKits } from '../../instruments/drums';
import styles from '../../styles/KitSelector.module.scss';

const KitSelector = ({ setSelectedKit }) => {

    const handleSelection = (e) => {
        setSelectedKit(allDrumKits[e.target.value])
    }

    return (
            <select onChange={handleSelection} className={styles.selectorDropdown}>
                {allDrumKits.map((item, index) => (
                    <option value={index} key={`${item.name}-${index}`} label={item.name} />
                ))}
            </select>
    )
}

export default KitSelector;