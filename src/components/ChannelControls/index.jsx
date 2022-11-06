import React from 'react';
import VolumeControl from './VolumeControl';
import SoloButton from './SoloButton';
import MuteButton from './MuteButton';

const ChannelControls = ({ index, data }) => {
    return (
        <div style={{ margin: 10 }}>
            <VolumeControl index={index} data={data} />
            <SoloButton index={index} data={data} />
            <MuteButton index={index} data={data} />
        </div>
    )
}

export default ChannelControls;