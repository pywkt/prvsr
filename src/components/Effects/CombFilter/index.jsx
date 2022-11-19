import React, { useEffect, useRef, useState } from 'react';
import Slider from '../../Slider';
import styles from '../../../styles/Effects.module.scss';

const CombFilter = ({ global, effectArray, addEffect, allEffects, effect, index, disabled, tone }) => {
    const [effectOn, setEffectOn] = useState(false);
    const effectRef = useRef({});

    console.log('effect:', effect)
    console.log('allEffects:', allEffects)

    const effectToUse = global?.[index]?.find(i => i.name === "FeedbackCombFilter")
    console.log('effectToUse:', effectToUse)

    const toggleEffect = () => {
        console.log('effectRef:', effectRef.current)
        if (effectOn) {
            effectRef.current[effect].set({
                resonance: 0,
            })
            setEffectOn(false)
        } else {
            setEffectOn(true)
            if (!allEffects[effect]) {
                effectRef.current[effect] = { name: effect, effect: new tone.FeedbackCombFilter({ resonance: 0 }) }
                addEffect(effect, effectRef.current[effect])
            }
        }
    }

    useEffect(() => {
        if (allEffects[effect]) {
            effectRef.current[effect] = effectArray.find(i => i.name === 'FeedbackCombFilter')
        }

    }, [effectArray, allEffects, effect])

    const setDelayTime = (e) => {
        effectToUse.set({
            delayTime: e.target.value
        })
    }

    const setResonance = (e) => {
        console.log('global:', global)
        effectToUse.set({
            resonance: Number(e.target.value),
        })
    }

    return (
        <div>
            <div className={styles.effectToggleContainer}>
                <input type="checkbox" id={`${effect}-checkbox-${index}`} disabled={!disabled} defaultValue={false} checked={effectOn} onChange={toggleEffect} />
                <label htmlFor={`${effect}-checkbox-${index}`}>Feedback Comb Filter</label>
            </div>
            {effectOn &&
                <>
                    <Slider
                        label="Delay Time"
                        type="delayTime"
                        index={index}
                        // min={1}
                        // max={8}
                        // step={1}
                        onChange={(e) => setDelayTime(e)}
                    />

                    <Slider
                        label="Resonance"
                        type="resonance"
                        index={index}
                        onChange={(e) => setResonance(e)}
                    />
                </>
            }
        </div>
    )
}

export default CombFilter;