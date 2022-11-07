import React, { useEffect, useRef, useState } from 'react';
import Slider from '../../Slider';

const Phaser = ({ global, effectArray, addEffect, allEffects, effect, index, disabled, tone }) => {
    const [effectOn, setEffectOn] = useState(false);
    const effectRef = useRef({});

    const effectToUse = global?.[index]?.find(i => i.name === "Phaser")

    const toggleEffect = () => {
        if (effectOn) {
            effectRef.current[effect].set({
                wet: 0,
            })
            setEffectOn(false)
        } else {
            setEffectOn(true)
            if (!allEffects[effect]) {
                effectRef.current[effect] = { name: effect, effect: new tone.Phaser({ wet: 0 }) }
                addEffect(effect, effectRef.current[effect])
            }
        }
    }

    useEffect(() => {
        if (allEffects[effect]) {
            effectRef.current[effect] = effectArray.find(i => i.name === 'Phaser')
        }

    }, [effectArray, allEffects, effect])

    const setBaseFreq = (e) => {
        effectToUse.set({
            baseFrequency: `${e.target.value}n`
        })
    }

    const setFreq = (e) => {
        effectToUse.set({
            frequency: Number(e.target.value)
        })
    }

    const setOctaves = (e) => {
        effectToUse.set({
            octaves: Number(e.target.value)
        })
    }

    const setStages = (e) => {
        effectToUse.set({
            stages: Number(e.target.value)
        })
    }

    const setWet = (e) => {
        effectToUse.set({
            wet: Number(e.target.value),
        })
    }


    return (
        <div>
            <input type="checkbox" id={`${effect}-checkbox-${index}`} disabled={!disabled} defaultValue={false} checked={effectOn} onChange={toggleEffect} />
            <label htmlFor={`${effect}-checkbox-${index}`}>Phaser</label>
            <br />
            {effectOn &&
                <>
                    <Slider
                        label="Base Freq."
                        type="baseFrequency"
                        index={index}
                        onChange={(e) => setBaseFreq(e)}
                        min={1}
                        max={16}
                        defaultValue={1}
                    />

                    <Slider
                        label="Frequency"
                        type="frequency"
                        index={index}
                        onChange={(e) => setFreq(e)}
                        min={1}
                        max={16}
                        defaultValue={1}
                    />

                    <Slider
                        label="Octaves"
                        type="octaves"
                        index={index}
                        onChange={(e) => setOctaves(e)}
                        min={0}
                        max={4}
                    />

                    <Slider
                        label="Stages"
                        type="stages"
                        index={index}
                        onChange={(e) => setStages(e)}
                        min={0}
                        max={4}
                    />

                    <Slider
                        label="Wet"
                        type="wet"
                        index={index}
                        onChange={(e) => setWet(e)}
                    />
                </>
            }
        </div>
    )
}


export default Phaser;