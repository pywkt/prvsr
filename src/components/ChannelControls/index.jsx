import React from 'react';
import VolumeControl from './VolumeControl';
import SoloButton from './SoloButton';
import MuteButton from './MuteButton';

const ChannelControls = ({ index, data, drums }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column'}}>
            <VolumeControl index={index} data={data} drums={drums} />
            <SoloButton index={index} data={data} drums={drums} />
            <MuteButton index={index} data={data} drums={drums} />
        </div>
    )
}

export default ChannelControls;