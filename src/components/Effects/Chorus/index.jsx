import React, { useEffect, useRef, useState } from 'react';
import Slider from '../../Slider';

const Chorus = ({ global, effectArray, addEffect, allEffects, effect, index, data, disabled, tone }) => {
    const [effectOn, setEffectOn] = useState(false);
    const effectRef = useRef({});
    console.log('chorus effectRef.current', effectRef.current)
    console.log('chorus allEffects:', allEffects)
    console.log('chorus effectArray:', effectArray)

    console.log('chorus global:', global)

    const effectToUse = global?.[index]?.find(i => i.name === "Chorus")

    const toggleEffect = async () => {
        if (effectOn) {
            effectRef.current[effect].set({
                wet: 0,
            })
            setEffectOn(false)
        } else {
            setEffectOn(true)
            if (!allEffects[effect]) {
                console.log('IF')
                effectRef.current[effect] = { name: 'chorus', effect: new tone.Chorus({ wet: 0 }) }
                addEffect('chorus', effectRef.current[effect]) 
                // addEffect('chorus', effectRef.current[effect])
            } 
            // else {
            //     console.log('ELSE')
            //     effectRef.current[effect] = effectArray.find(i => i.name === 'Chorus')
            //     data.slug.chain(...effectArray, data.channel, tone.Destination)
            // }

            // const chorus = effectRef.current[effect]
            // addEffect('chorus', new tone.Chorus({ wet: 0 }))
            // console.log('chorus effectRef.current 01:', effectRef.current.chorus)
            // const chorus = effectRef.current.chorus || null
            // await addEffect('chorus', chorus) 
            // console.log('check:', effectArray)

            //  else {
                
            // }

            // data.slug.chain(...effectArray, data.channel, tone.Destination)
        }
    }

    useEffect(() => {
        console.log('USE EFFECT')
        if (allEffects[effect]) {
            console.log('USE EFFECT INSIDE')
            effectRef.current[effect] = effectArray.find(i => i.name === 'Chorus')
            // data.slug.chain(...effectArray, data.channel, tone.Destination)
        }
        
    }, [effectArray, data, allEffects, effect, tone])

    // useEffect(() => {
    //     if (!allEffects[effect]) {
    //         console.log('IF')
    //         effectRef.current[effect] = { name: 'chorus', effect: new tone.Chorus({ wet: 0 }) }
    //         // addEffect('chorus', effectRef.current[effect])
    //     } else {
    //         console.log('ELSE')
    //         effectRef.current[effect] = effectArray.find(i => i.name === 'Chorus')
    //         data.slug.chain(...effectArray, data.channel, tone.Destination)
    //     }
    // }, [effect, tone.Chorus, allEffects, effectArray])

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
        allEffects[effect].effect.set({
            wet: Number(e.target.value),
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
            <input type="checkbox" id={`chorus-checkbox-${index}`} disabled={!disabled} defaultValue={false} checked={effectOn} onChange={toggleEffect} />
            <label htmlFor={`chorus-checkbox-${index}`}>Chorus</label>
            <br />
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