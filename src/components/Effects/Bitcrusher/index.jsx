import React, { useEffect, useRef, useState } from 'react';
import Slider from '../../Slider';
import styles from '../../../styles/Effects.module.scss';

const Bitcrusher = ({ global, effectArray, addEffect, allEffects, effect, index, disabled, tone }) => {
    const [effectOn, setEffectOn] = useState(false);
    const effectRef = useRef({});

    const effectToUse = global?.[index]?.find(i => i.name === "BitCrusher")

    const toggleEffect = () => {
        if (effectOn) {
            effectRef.current[effect].set({
                wet: 0,
            })
            setEffectOn(false)
        } else {
            setEffectOn(true)
            if (!allEffects[effect]) {
                effectRef.current[effect] = { name: effect, effect: new tone.BitCrusher({ bits: 1, wet: 0 }) }
                addEffect(effect, effectRef.current[effect])
            }
        }
    }

    useEffect(() => {
        if (allEffects[effect]) {
            effectRef.current[effect] = effectArray.find(i => i.name === 'BitCrusher')
        }

    }, [effectArray, allEffects, effect])

    const handleBits = (e) => {
        effectToUse.set({
            bits: Number(e.target.value)
        })
    }

    const handleWet = (e) => {
        effectToUse.set({
            wet: Number(e.target.value)
        })
    }


    return (
        <div>
            <div className={styles.effectToggleContainer}>
                <input type="checkbox" id={`bitcrusher-checkbox-${index}`} disabled={!disabled} defaultValue={false} checked={effectOn} onChange={toggleEffect} />
                <label htmlFor={`bitcrusher-checkbox-${index}`}>Bitcrusher</label>
            </div>
            {effectOn &&
                <>
                    <Slider
                        label="Bits"
                        type="bitcrusher"
                        index={index}
                        onChange={(e) => handleBits(e, 'bitcrusher')}
                        min={1}
                        max={16}
                        step={0.5}
                    />

                <Slider
                    label="Wet"
                    type="bitcrusher"
                    index={index}
                    onChange={(e) => handleWet(e, 'bitcrusher')}
                    // min={1}
                    // max={16}
                    // step={0.5}
                />
                </>
            }
        </div>
    )
}


export default Bitcrusher;