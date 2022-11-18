import React, { useEffect, useRef, useState } from 'react';
import Slider from '../../Slider';
import styles from '../../../styles/Effects.module.scss';

const StereoWidener = ({ global, effectArray, addEffect, allEffects, effect, index, disabled, tone }) => {
    const [effectOn, setEffectOn] = useState(false);
    const effectRef = useRef({});

    const effectToUse = global?.[index]?.find(i => i.name === "StereoWidener")

    const toggleEffect = () => {
        if (effectOn) {
            effectRef.current[effect].set({
                wet: 0,
            })
            setEffectOn(false)
        } else {
            setEffectOn(true)
            if (!allEffects[effect]) {
                effectRef.current[effect] = { name: effect, effect: new tone.StereoWidener({ wet: 0 }) }
                addEffect(effect, effectRef.current[effect])
            }
        }
    }

    useEffect(() => {
        if (allEffects[effect]) {
            effectRef.current[effect] = effectArray.find(i => i.name === 'StereoWidener')
        }

    }, [effectArray, allEffects, effect])

    const setWidth = (e) => {
        effectToUse.set({
            width: Number(e.target.value)
        })
    }

    const setWet = (e) => {
        console.log('global:', global)
        effectToUse.set({
            wet: Number(e.target.value),
        })
    }


    return (
        <div>
            <div className={styles.effectToggleContainer}>
                <input type="checkbox" id={`${effect}-checkbox-${index}`} disabled={!disabled} defaultValue={false} checked={effectOn} onChange={toggleEffect} />
                <label htmlFor={`${effect}-checkbox-${index}`}>Stereo Widener</label>
            </div>
            {effectOn &&
                <>
                    <Slider
                        label="Width"
                        type="width"
                        index={index}
                        onChange={(e) => setWidth(e)}
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


export default StereoWidener;