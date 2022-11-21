import React, { useState } from 'react';
import useCollapse from 'react-collapsed'
import KitSelector from './KitSelector';
import VolumeControl from '../ChannelControls/VolumeControl';
import MuteButton from '../ChannelControls/MuteButton';
import SoloButton from '../ChannelControls/SoloButton';
import StartTime from './StartTime';
import SequenceLength from './SequenceLength';
import DrumPlaybackRate from './DrumPlaybackRate';
import { ReactComponent as Chevron } from '../../icons/chevron-up.svg';
import styles from '../../styles/Sequencer.module.scss';

const DrumControls = ({ changeDrumRate, changeDrumSteps, data, index, register, setSelectedKit }) => {
    const { getCollapseProps, getToggleProps } = useCollapse();

    const [controlOpen, setControlOpen] = useState(false)
    const handleControlOpen = () => setControlOpen(prev => !prev)

    return (
        <div>
            <div
                {...getToggleProps({ onClick: handleControlOpen })}
                className={styles.sequencerAccordionLabel}
            >
                <div className={styles.controlLabel}>
                    <span>Drum Controls</span>
                    <span className={controlOpen ? styles.rotatedChevron : styles.notRotatedChevron}>
                        <Chevron />
                    </span>

                </div>
            </div>
            <div {...getCollapseProps()}>
                <div className={styles.sequencerGridControlsContainer}>
                    <KitSelector setSelectedKit={setSelectedKit} />
                    <SequenceLength changeDrumSteps={changeDrumSteps} />
                    <StartTime register={register} />
                    <DrumPlaybackRate rateCallback={(rate) => changeDrumRate(rate)} />
                    <VolumeControl index={index} data={data} drums />
                    <MuteButton index={index} data={data} drums />
                    <SoloButton index={index} data={data} drums />
                </div>
            </div>
        </div>
    )
}

export default DrumControls;