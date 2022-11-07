import React, { useEffect, useRef, useState } from 'react';
import Slider from '../../Slider';

const Reverb = ({ global, effectArray, addEffect, allEffects, effect, index, disabled, tone }) => {
    const [effectOn, setEffectOn] = useState(false);
    const effectRef = useRef({});

    const effectToUse = global?.[index]?.find(i => i.name === "JCReverb")

    const toggleEffect = () => {
        if (effectOn) {
            effectRef.current[effect].set({
                wet: 0,
            })
            setEffectOn(false)
        } else {
            setEffectOn(true)
            if (!allEffects[effect]) {
                effectRef.current[effect] = { name: effect, effect: new tone.JCReverb({ wet: 0 }) }
                addEffect(effect, effectRef.current[effect])
            }
        }
    }

    useEffect(() => {
        if (allEffects[effect]) {
            effectRef.current[effect] = effectArray.find(i => i.name === 'JCReverb')
        }

    }, [effectArray, allEffects, effect])

    const setRoomSize = (e) => {
        effectToUse.set({
            roomSize: Number(e.target.value),
        })
    }

    const setWet = (e) => {
        effectToUse.set({
            wet: Number(e.target.value),
        })
    }


    return (
        <div>
            <input type="checkbox" id={`reverb-checkbox-${index}`} disabled={!disabled} defaultValue={false} checked={effectOn} onChange={toggleEffect} />
            <label htmlFor={`reverb-checkbox-${index}`}>Reverb</label>
            <br />
            {effectOn &&
                <>
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