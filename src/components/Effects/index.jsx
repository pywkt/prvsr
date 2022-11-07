import React, { useRef, useState } from 'react';
import Chorus from './Chorus';
import PingPongDelay from './PingPongDelay';
import Reverb from './Reverb';

export let globalEffects = {}

const Effects = ({ disabled, index, partData, tone }) => {
    const [allEffects, setAllEffects] = useState({})
    const [effectArray, setEffectArray] = useState([])
    console.log('effect globalEffects:', globalEffects)

    console.log('effects allEffects:', allEffects)

    const effectRef = useRef({})
    console.log('effects effectRef:', effectRef.current)

    const effectRefArr = useRef([])
    console.log('partData:', partData)

    const addEffect = (effectName, effect) => {
        console.log('effects addEffect:', effectName, effect)
        console.log('effects addEffect before set ref:', effectRef.current)

        if (!effectRef.current[effectName]) {
            effectRef.current[effectName] = effect
            const arrs = Object.values(effectRef.current).map(i => i.effect)
            console.log('arrs:', arrs)
            setEffectArray(arrs)
            setAllEffects(effectRef.current)
            console.log('index:', index)
            globalEffects[index] = arrs
            // effectRefArr.current.push(effect.effect)
            // setAllEffects(effectRef.current)
            // setEffectArray(effectRefArr.current)
        }

        console.log('effectRefArr:', index, effectRefArr.current)

    }

    const removeEffect = (effectName) => {
        delete effectRef.current[effectName]
        setAllEffects(effectRef.current)
    }

    return (
        <div>
            <PingPongDelay
                global={globalEffects}
                effectArray={effectArray}
                allEffects={allEffects}
                addEffect={(effectName, effect) => addEffect(effectName, effect)}
                effect="delay"
                index={index}
                data={partData}
                disabled={disabled}
                tone={tone}
            />
            
            <Chorus
                global={globalEffects}
                effectArray={effectArray}
                allEffects={allEffects}
                addEffect={(effectName, effect) => addEffect(effectName, effect)}
                effect="chorus"
                index={index}
                disabled={disabled}
                tone={tone}
            />

            <Reverb
                global={globalEffects}
                effectArray={effectArray}
                allEffects={allEffects}
                addEffect={(effectName, effect) => addEffect(effectName, effect)}
                effect="reverb"
                index={index}
                disabled={disabled}
                tone={tone}
            />
        </div>
    )
}

export default Effects;