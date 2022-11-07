import React, { useEffect, useRef, useState } from 'react';
import Slider from '../../Slider';

const PingPongDelay = ({ global, effectArray, addEffect, allEffects, effect, index, data, disabled, tone }) => {
    const [effectOn, setEffectOn] = useState(false);
    const effectRef = useRef({});
    // console.log('effectRef:', effectRef)

    console.log('delay global:', global)
    const effectToUse = global?.[index]?.find(i => i.name === "PingPongDelay")

    const toggleEffect = () => {
        if (effectOn) {
            effectRef.current[effect].set({
                wet: 0,
            })
            setEffectOn(false)
        } else {
            setEffectOn(true)

            if (!allEffects[effect]) {
                console.log('DELAY IF')
                effectRef.current[effect] = { name: 'delay', effect: new tone.PingPongDelay({ wet: 0 }) }
                addEffect('delay', effectRef.current[effect])
                // addEffect('chorus', effectRef.current[effect])
            } 
            
            // const delay = effectRef.current[effect]
            // addEffect("delay", delay)
            // data.slug.chain(delay, data.channel, tone.Destination)
        }
    }

    useEffect(() => {
        console.log('DELAY USE EFFECT')
        if (allEffects[effect]) {
            console.log('DELAY USE EFFECT INSIDE')
            effectRef.current[effect] = effectArray.find(i => i.name === 'delay')
            // data.slug.chain(...effectArray, data.channel, tone.Destination)
        }

    }, [effectArray, data, allEffects, effect, tone])

    // useEffect(() => {
    //     if (!effectRef.current[effect]) {
    //         effectRef.current[effect] = new tone.PingPongDelay({ wet: 0 })
    //     }
    // }, [effect, tone.PingPongDelay])

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
        console.log('delay effectToUse:', effectToUse)
        effectToUse.set({
            wet: Number(e.target.value),
        })
    }

    return (
        <div>
            <input type="checkbox" id={`delay-checkbox-${index}`} disabled={!disabled} defaultValue={false} checked={effectOn} onChange={toggleEffect} />
            <label htmlFor={`delay-checkbox-${index}`}>Ping-Pong Delay</label>
            <br />
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