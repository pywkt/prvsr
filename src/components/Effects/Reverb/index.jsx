import React, { useEffect, useRef, useState } from 'react';
import Slider from '../../Slider';

const Reverb = ({ effect, index, data, disabled, tone }) => {
    const [effectOn, setEffectOn] = useState(false);
    const effectRef = useRef({});
    // console.log('pan ref:', effectRef.current[effect])

    const toggleEffect = () => {
        if (effectOn) {
            // effectRef.current[effect].set()
            setEffectOn(false)
        } else {
            setEffectOn(true)
            const reverb = effectRef.current[effect]
            // console.log('else:', panner3d)
            data.slug.chain(reverb, data.channel, tone.Destination)
        }
    }

    useEffect(() => {
        if (!effectRef.current[effect]) {
            effectRef.current[effect] = new tone.JCReverb({ wet: 0 })
        }
    }, [effect, tone.Reverb])

    // const setDecay = (e, effect) => {
    //     effectRef.current[effect].set({
    //         decay: Number(e.target.value)
    //     })
    // }

    const setRoomSize = (e, effect) => {
        effectRef.current[effect].set({
            roomSize: Number(e.target.value),
        })
    }

    const setWet = (e, effect) => {
        effectRef.current[effect].set({
            wet: Number(e.target.value),
        })
    }


    return (
        <div>
            <input type="checkbox" id={`panner-checkbox-${index}`} disabled={!disabled} defaultValue={false} checked={effectOn} onChange={toggleEffect} />
            <label htmlFor={`panner-checkbox-${index}`}>panner</label>
            <br />
            {effectOn &&
                <>
                    {/* <Slider
                        label="Decay"
                        type="decay"
                        index={index}
                        onChange={(e) => setDecay(e, 'reverb')}
                        max={5}
                        step={0.2}
                    /> */}

                    <Slider
                        label="Room Size"
                        type="roomSize"
                        index={index}
                        onChange={(e) => setRoomSize(e, 'reverb')}
                    />

                    <Slider
                        label="Wet"
                        type="wet"
                        index={index}
                        onChange={(e) => setWet(e, 'reverb')}
                    />
                </>
            }
        </div>
    )
}


export default Reverb;