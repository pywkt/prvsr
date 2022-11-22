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
    console.log('mods:', instrument)
    const canUse = (key) => instrument && Object.keys(instrument).includes(key)
    const [selectedOsc, setSelectedOsc] = useState('')

    const envelope = ['attack', 'sustain', 'decay', 'release']
    const oscTypes = ['sine', 'square', 'triangle', 'sawtooth', 'pwm', 'pulse']
    const oscOptions = [
        { name: 'detune', min: -500, max: 500, step: 1 },
        { name: 'frequency', min: 1, max: 4, step: 1 },
        { name: 'harmonicity', min: 0, max: 500, step: 1 },
        { name: 'phase', min: -360, max: 360, step: 1 },
        { name: 'partialsCount', min: 0, max: 30, step: 1 }]

    const notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

    const setEnvelope = (e, param) => {
        globalMods.envelope = { ...globalMods.envelope, [param]: Number(e.target.value) }
        instrument.set({ envelope: { [param]: Number(e.target.value) } })
    }

    const setFilterEnvelope = (e, param) => {
        globalMods.filterEnvelope = { ...globalMods.filterEnvelope, [param]: Number(e.target.value) }
        instrument.set({ filterEnvelope: { [param]: Number(e.target.value) } })
    }

    const setModIndex = (e, param) => {
        globalMods.modulationIndex = Number(e.target.value)
        instrument.set({ modulationIndex: Number(e.target.value) })
    }

    const changeOscType = (type) => {
        setSelectedOsc(type)
        globalMods.oscillator = { ...globalMods.oscillator, type }
        instrument.set({ oscillator: { type } })
    }

    const changeHarmonicity = (value) => {
        globalMods.harmonicity = Number(value)
        instrument.set({ harmonicity: Number(value) })
    }

    const changeAttackNoise = (value) => {
        globalMods.attackNoise = Number(value)
        instrument.set({ attackNoise: Number(value) })
    }

    const changeDampening = (value) => {
        globalMods.resonance = Number(value)
        instrument.set({ resonance: Number(value) })
    }

    const changeRelease = (value) => {
        globalMods.release = value
        instrument.set({ release: value})
        console.log(instrument.get())
    }

    // const changeModulation = (e, param) => {
    //     instrument.filter.frequency.override = false
    //     console.log(notes[e.target.value]+e.target.value)
    //     globalMods.filter = { ...globalMods.filter, frequency: {value: notes[e.target.value] + e.target.value, override: false}}
    //     instrument.filter.set({ frequency: notes[e.target.value] + e.target.value })

    // }

    // const changeFrequency = (value) => {
    //     globalMods.frequency = value
    //     instrument.frequency.value = value
    // }

    // const setPortamento = (e) => {
    //     instrument.set({ portamento: Number(e.target.value) })
    // }

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


            {instrument && canUse('envelope') &&
                <>
                    <h4>Envelope:</h4>
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
                </>
            }


            {instrument && canUse('filterEnvelope') &&
                <>
                    <h4>Filter Envelope:</h4>
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
                </>
            }


            {instrument && canUse('modulationIndex') &&
                <>
                    <h4>Modulation:</h4>
                    <div className={styles.envelopeParams}>
                        <Slider
                            label="Index"
                            type="modulation"
                            index={index}
                            onChange={(e) => setModIndex(e)}
                            min={0}
                            max={30}
                            step={1}
                        />
                    </div>
                </>
            }

            {instrument && canUse('harmonicity') &&
                <>
                    <h4>Harmonicity:</h4>
                    <div className={styles.envelopeParams}>
                        <Slider
                            label="Harmonicity"
                            type="harmonicity"
                            index={index}
                            onChange={(e) => changeHarmonicity(e.target.value)}
                            min={0}
                            max={30}
                            step={1}
                        />
                    </div>
                </>
            }

            {instrument && /pluckSynth/.test(instrument.name) &&
                <>
                    {/* <h4>Attack Noise:</h4> */}
                    <div className={styles.envelopeParams}>
                        <Slider
                            label="Attack Noise"
                            type="attackNoise"
                            index={index}
                            onChange={(e) => changeAttackNoise(e.target.value)}
                            min={0}
                            max={30}
                            step={1}
                        />
                    </div>

                <div className={styles.envelopeParams}>
                    <Slider
                        label="Resonance"
                        type="resonance"
                        index={index}
                        onChange={(e) => changeDampening(e.target.value)}
                        min={0}
                        max={0.999}
                        step={0.05}
                    />
                </div>

                <div className={styles.envelopeParams}>
                    <Slider
                        label="Release"
                        type="release"
                        index={index}
                        onChange={(e) => changeRelease(e.target.value)}
                        min={1}
                        max={16}
                        step={1}
                    />
                </div>
                </>
            }

            {/* {instrument && canUse('frequency') &&
                <>
                    <div className={styles.envelopeParams}>
                        <Slider
                            label="Frequency"
                            type="frequency"
                            index={index}
                            onChange={(e) => changeFrequency(e.target.value)}
                            min={0}
                            max={30}
                            step={1}
                        />

                    </div>
                </>
            } */}
{/* 
            {instrument && canUse('filter') &&
                <>
                    <div className={styles.envelopeParams}>

                        {oscOptions.map(param => (
                            <Slider
                                key={param.name}
                                label={param.name}
                                type={param.name}
                                index={index}
                                onChange={(e) => changeModulation(e, param.name)}
                                min={param.min}
                                max={param.max}
                                step={param.step}
                            />
                        ))}

                    </div>
                </>
            } */}





        </>

    )
}

export default InstrumentMods