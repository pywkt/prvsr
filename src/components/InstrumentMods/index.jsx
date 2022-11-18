import React, { useState } from 'react';
import Button from '../Button';
import Slider from '../Slider';
import styles from '../../styles/InstrumentMods.module.scss';

/**
 * 
 * @param {object} instrument The Tonejs instrument that will be modified.
 * @param {number} index The index of the part that is being modified.
 * @returns A set of sliders that control various parameters of the instrument.
 */

export let globalMods = {}


const InstrumentMods = ({ instrument, index }) => {
    console.log(globalMods)
    const canUse = (key) => instrument && Object.keys(instrument).includes(key)
    const [selectedOsc, setSelectedOsc] = useState('')

    const envelope = ['attack', 'sustain', 'decay', 'release']
    const oscTypes = ['sine', 'square', 'triangle', 'sawtooth', 'pwm', 'pulse']

    const setEnvelope = (e, param) => {
        instrument.set({ envelope: { [param]: Number(e.target.value) } })
    }

    const setFilterEnvelope = (e, param) => {
        instrument.set({ filterEnvelope: { [param]: Number(e.target.value) } })
    }

    const changeOscType = (type) => {
        setSelectedOsc(type)
        globalMods.oscillator = { type }
        instrument.set({ oscillator: { type } })
    }

    const setPortamento = (e) => {
        instrument.set({ portamento: Number(e.target.value) })
    }

    return (
        <>
            {/* {canUse('portamento') &&
                <div>
                    <span>Instrument Mods:</span>
                    <br />
                    <Slider
                        label="Portamento"
                        type="port"
                        index={0}
                        onChange={(e) => setPortamento(e)}
                        min={0}
                        max={1}
                        step={0.01}
                    />
                </div>
            }

            <br /> */}

            <div className={styles.oscTypes}>
                {instrument && canUse('oscillator') &&
                    <div>
                        {oscTypes.map(type => (
                            <Button customClass={selectedOsc === type ? styles.oscTypeSelected : ''} key={type} label={type} onClick={() => changeOscType(type)} />
                        ))}
                    </div>
                }
            </div>


            <h4>Oscillator Mods:</h4>
            {/* <br /> */}

            {instrument && canUse('filterEnvelope') &&
                <div className={styles.envelopeParams}>
                    {envelope.map(param => (
                            <Slider
                                key={param}
                                label={param}
                                type={param}
                                index={index}
                                onChange={(e) => setFilterEnvelope(e, param)}
                                min={0}
                                max={param === 'sustain' ? 1 : 30}
                                step={param === 'sustain' ? 0.1 : 1}
                            />
                    ))}
                </div>
            }


            {/* <hr /> */}

            <br />

            <h4>Envelope Mods:</h4>
            {/* <br /> */}
            {instrument && canUse('envelope') &&
                <div className={styles.envelopeParams}>

                    {envelope.map(param => (
                            <Slider
                                key={param}
                                label={param}
                                type={param}
                                index={index}
                                onChange={(e) => setEnvelope(e, param)}
                                min={0}
                                max={param === 'sustain' ? 1 : 30}
                                step={param === 'sustain' ? 0.1 : 1}
                            />
                    ))}

                </div>
            }

        </>

    )
}

export default InstrumentMods