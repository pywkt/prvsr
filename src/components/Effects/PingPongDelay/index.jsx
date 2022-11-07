import React, { useEffect, useRef, useState } from 'react';
import Slider from '../../Slider';

const PingPongDelay = ({ effect, index, data, disabled, tone }) => {
    const [effectOn, setEffectOn] = useState(false);
    const effectRef = useRef({});

    const toggleEffect = () => {
        if (effectOn) {
            effectRef.current[effect].set({
                wet: 0,
            })
            setEffectOn(false)
        } else {
            setEffectOn(true)
            const delay = effectRef.current[effect]
            data.slug.chain(delay, data.channel, tone.Destination)
        }
    }

    useEffect(() => {
        if (!effectRef.current[effect]) {
            effectRef.current[effect] = new tone.PingPongDelay({ wet: 0 })
        }
    }, [effect, tone.PingPongDelay])

    const handleDelayTime = (e, effect) => {
        effectRef.current[effect].set({
            delayTime: `${e.target.value}n`
        })
    }

    const handleFeedback = (e, effect) => {
        effectRef.current[effect].set({
            feedback: Number(e.target.value),
        })
    }

    const handleMaxDelay = (e, effect) => {
        effectRef.current[effect].set({
            maxDelay: Number(e.target.value),
        })
    }

    const handleWet = (e, effect) => {
        effectRef.current[effect].set({
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