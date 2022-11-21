import React, { useState } from 'react';
import useCollapse from 'react-collapsed'
import Effects from '../Effects';
import { ReactComponent as Chevron } from '../../icons/chevron-up.svg';
import styles from '../../styles/Sequencer.module.scss';

const DrumEffects = ({ disabled, index, partData, tone }) => {
    const { getCollapseProps, getToggleProps } = useCollapse();

    const [effectsOpen, setEffectsOpen] = useState(false)
    const handleEffectsOpen = () => setEffectsOpen(prev => !prev)

    return (
        <div className="collapsible">
            <div
                {...getToggleProps({ onClick: handleEffectsOpen })}
                className={styles.sequencerAccordionLabel}
            >
                <div className={styles.effectsLabel}>
                    <span>Drum Effects</span>
                    <span className={effectsOpen ? styles.rotatedChevron : styles.notRotatedChevron}>
                        <Chevron />
                    </span>
                </div>

            </div>
            <div {...getCollapseProps()}>
                <div className={styles.sequencerEffectsGrid}>
                    <Effects index={index} partData={partData} disabled={disabled} tone={tone} />
                </div>
            </div>
        </div>
    )
}

export default DrumEffects