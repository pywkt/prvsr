import React, { useEffect, useRef, useState } from 'react';
import Slider from '../../Slider';
import styles from '../../../styles/Effects.module.scss';

const PingPongDelay = ({ global, effectArray, addEffect, allEffects, effect, index, disabled, tone, removeEffect }) => {
    const [effectOn, setEffectOn] = useState(false);
    const effectRef = useRef({});
    console.log("index:", index)

    const effectToUse = global?.[index]?.find(i => i.name === "PingPongDelay")

    const toggleEffect = () => {
        if (effectOn) {
            effectRef.current[effect].set({
                wet: 0,
            })
            removeEffect(effect)
            setEffectOn(false)
        } else {
            setEffectOn(true)
            if (!allEffects[effect]) {
                effectRef.current[effect] = { name: effect, effect: new tone.PingPongDelay({ wet: 0 }) }
                addEffect(effect, effectRef.current[effect])
            }
        }
    }

    useEffect(() => {
        if (allEffects[effect]) {
            effectRef.current[effect] = effectArray.find(i => i.name === 'PingPongDelay')
        }

    }, [effectArray, allEffects, effect])

    const handleDelayTime = (e, effect) => {
        effectToUse.set({
            delayTime: `${e.target.value}n`
        })
    }

    const handleFeedback = (e, effect) => {
        effectToUse.set({
            feedback: Number(e.target.value),
        })
    }

    const handleMaxDelay = (e, effect) => {
        effectToUse.set({
            maxDelay: Number(e.target.value),
        })
    }

    const handleWet = (e, effect) => {
        effectToUse.set({
            wet: Number(e.target.value),
        })
    }

    return (
        <div>
            <div className={styles.effectToggleContainer}>
                <input type="checkbox" id={`delay-checkbox-${index}`} disabled={!disabled} defaultValue={false} checked={effectOn} onChange={toggleEffect} />
                <label htmlFor={`delay-checkbox-${index}`} disabled={!disabled}>Ping-Pong Delay</label>
            </div>

            {/* <br /> */}
            {effectOn &&
                <>
                    <Slider
                        label="Delay Time"
                        type="delayTime"
                        index={index}
                        onChange={(e) => handleDelayTime(e, 'delay')}
                        min={1}
                        max={16}
                        step={1}
                    />

                    <Slider
                        label="Feedback"
                        type="feedback"
                        index={index}
                        onChange={(e) => handleFeedback(e, 'delay')}
                    />

                    <Slider
                        label="Max Delay"
                        type="maxDelay"
                        index={index}
                        onChange={(e) => handleMaxDelay(e, 'delay')}
                        max={3}
                        defaultValue={3}
                    />


                    <Slider
                        label="Wet"
                        type="wet"
                        index={index}
                        onChange={(e) => handleWet(e, 'delay')}
                    />

                </>
            }
        </div>
    )
}


export default PingPongDelay;