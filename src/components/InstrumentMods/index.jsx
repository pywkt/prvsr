import React from 'react';
import Slider from '../Slider';

const InstrumentMods = ({ instrument, index }) => {

    const envelope = ['attack', 'sustain', 'decay', 'release']

    const setEnvelope = (e, param) => {
        instrument.set({ envelope: { [param]: Number(e.target.value) } })
        console.log('get:', instrument.get())
    }

    return (
        <>
            {envelope.map(param => (
                <Slider
                    key={param}
                    label={param}
                    type={param}
                    index={index}
                    onChange={(e) => setEnvelope(e, param)}
                    min={0}
                    max={param === 'sustain' ? 1 : 30}
                    step={param === 'sustain' ? 0.1 : 1}
                />
            ))}
        </>

    )
}

export default InstrumentMods