import React, { useRef, useState } from 'react';
import Chorus from './Chorus';
import PingPongDelay from './PingPongDelay';
import Reverb from './Reverb';
import StereoWidener from './StereoWidener';
import Phaser from './Phaser';
import Slider from '../Slider';

export let globalEffects = {}

const Effects = ({ disabled, index, partData, tone }) => {
    const [allEffects, setAllEffects] = useState({})
    const [effectArray, setEffectArray] = useState([])
    const effectRef = useRef({})

    const addEffect = (effectName, effect) => {
        if (!effectRef.current[effectName]) {
            effectRef.current[effectName] = effect
            const arrs = Object.values(effectRef.current).map(i => i.effect)
            setEffectArray(arrs)
            setAllEffects(effectRef.current)
            globalEffects[index] = arrs
        }
    }

    const removeEffect = (effectName) => {
        delete effectRef.current[effectName]
        const arrs = Object.values(effectRef.current).map(i => i.effect)
        setEffectArray(arrs)
        setAllEffects(effectRef.current)
        globalEffects[index] = arrs
    }

    // const changeMono = (e) => {
    //     console.log('effects partData:', partData)
    //     partData.slug.set({ envelope: { attack: Number(e.target.value) } })
    //     // partData.slug.envelope = { ...partData.slug.envelope, attack: e.target.data}
    // }

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
                removeEffect={(effectName) => removeEffect(effectName)}
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

            <StereoWidener
                global={globalEffects}
                effectArray={effectArray}
                allEffects={allEffects}
                addEffect={(effectName, effect) => addEffect(effectName, effect)}
                effect="stereoWidener"
                index={index}
                disabled={disabled}
                tone={tone}
            />

            <Phaser
                global={globalEffects}
                effectArray={effectArray}
                allEffects={allEffects}
                addEffect={(effectName, effect) => addEffect(effectName, effect)}
                effect="phaser"
                index={index}
                disabled={disabled}
                tone={tone}
            />
        </div>
    )
}

export default Effects;