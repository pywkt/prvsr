import React, { useEffect, useRef, useState } from 'react';
import Slider from '../../Slider';
import styles from '../../../styles/Effects.module.scss';

const Chorus = ({ global, effectArray, addEffect, allEffects, effect, index, disabled, tone }) => {
    const [effectOn, setEffectOn] = useState(false);
    const effectRef = useRef({});

    const effectToUse = global?.[index]?.find(i => i.name === "Chorus")

    const toggleEffect = () => {
        if (effectOn) {
            effectRef.current[effect].set({
                wet: 0,
            })
            setEffectOn(false)
        } else {
            setEffectOn(true)
            if (!allEffects[effect]) {
                effectRef.current[effect] = { name: effect, effect: new tone.Chorus({ wet: 0 }) }
                addEffect(effect, effectRef.current[effect])
            }
        }
    }

    useEffect(() => {
        if (allEffects[effect]) {
            effectRef.current[effect] = effectArray.find(i => i.name === 'Chorus')
        }

    }, [effectArray, allEffects, effect])

    const handleDelayTime = (e, effect) => {
        effectToUse.set({
            delayTime: Number(e.target.value)
        })
    }

    const handleFeedback = (e, effect) => {
        console.log('global:', global)
        effectToUse.set({
            feedback: Number(e.target.value),
        })
    }

    const handleDepth = (e, effect) => {
        effectToUse.set({
            depth: Number(e.target.value),
        })
    }

    const handleWet = (e, effect) => {
        console.log('wet:', effectRef.current)
        // allEffects[effect].effect.set({
        //     wet: Number(e.target.value),
        // })
        effectToUse.set({
            wet: Number(e.target.value)
        })
    }

    const handleFrequency = (e, effect) => {
        effectToUse.set({
            frequency: `${e.target.value}n`
        })
    }

    const handleSpread = (e, effect) => {
        effectToUse.set({
            spread: e.target.value
        })
    }


    return (
        <div>
            <div className={styles.effectToggleContainer}>
                <input type="checkbox" id={`chorus-checkbox-${index}`} disabled={!disabled} defaultValue={false} checked={effectOn} onChange={toggleEffect} />
                <label htmlFor={`chorus-checkbox-${index}`}>Chorus</label>
            </div>
            {effectOn &&
                <>
                    <Slider
                        label="Delay Time"
                        type="delayTime"
                        index={index}
                        onChange={(e) => handleDelayTime(e, 'chorus')}
                        min={0}
                        max={5000}
                        step={100}
                    />

                    <Slider
                        label="Feedback"
                        type="feedback"
                        index={index}
                        onChange={(e) => handleFeedback(e, 'chorus')}
                    />

                    <Slider
                        label="Depth"
                        type="depth"
                        index={index}
                        onChange={(e) => handleDepth(e, 'chorus')}
                    />

                    <Slider
                        label="Wet"
                        type="wet"
                        index={index}
                        onChange={(e) => handleWet(e, 'chorus')}
                    />

                    <Slider
                        label="Frequency"
                        type="frequency"
                        index={index}
                        onChange={(e) => handleFrequency(e, 'chorus')}
                        min={1}
                        max={16}
                        step={1}
                    />

                    <Slider
                        label="Spread"
                        type="spread"
                        index={index}
                        onChange={(e) => handleSpread(e, 'chorus')}
                        min={0}
                        max={360}
                        step={1}
                    />
                </>
            }
        </div>
    )
}


export default Chorus;