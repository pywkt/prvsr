import React, { useState, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import Button from '../Button';
import StepBoxes from './StepBoxes';
import { allDrumKits, makeNewDrums } from '../../instruments/drums';
import DrumControls from './DrumControls';
import DrumEffects from './DrumEffects';
import styles from '../../styles/Sequencer.module.scss';

const Sequencer = ({ setDrumPart, tone }) => {
    const { register, setValue, control, getValues, watch } = useForm();
    useFieldArray({ control, name: "drums" })

    const [drumSteps, setDrumSteps] = useState(16)
    const [selectedKit, setSelectedKit] = useState(allDrumKits[0])

    const drumRef = useRef([])
    const drumRateRef = useRef(2)
    const newRef = useRef({ kick: [], kick1: [], snare: [], hihat: [], ohihat: [], lowtom: [], hitom: [], conga1: [], conga2: [] });

    const changeDrumSteps = (newSteps) => {
        setDrumSteps(Number(newSteps))
    }

    const changeDrumRate = (rate) => {
        drumRateRef.current = rate
    }

    const makeDrums = () => {
        // console.log("sss:", selectedKit)
        setSelectedKit(makeNewDrums(selectedKit.name))
        // console.log("sss02:", selectedKit)

        const drumData = getValues(`drums`)
        const drumParts = Object.keys(drumData)

        const fff = drumParts.filter(d => d !== 'startTime' && d !== 'channel')
        const allDrums = []
        fff.map((d, i) => {
            allDrums.push(drumData[d].filter(a => a.note !== ''))
            return drumRef.current[d] = { partData: [...allDrums[i].map(ad => ad)], slug: selectedKit.instrument.kit, channel: selectedKit.instrument.channel, name: d, startTime: drumData.startTime, type: 'drum' }
        })

        // console.log("drumRef.current:", drumRef.current)

        setValue(`drums.channel`, selectedKit.instrument.channel)
        setDrumPart(drumRef.current, drumSteps, drumRateRef.current)
    }

    const checkAndMakeSteps = (track) => {
        if (newRef.current[track]?.length === 0) {
            for (let i = 0; i < drumSteps; i += 1) {
                newRef.current[track].push({ time: `0:0:0`, note: '' })
            }
        }
    }

    const handleKickChange = (index, track) => {
        // console.log('track:', track)
        const bars = String(index / 4).split(".")[0]
        const qNotes = index % 4

        const trackNotes = (track) => {
            switch (track) {
                case 'kick':
                    return 'C4';
                case 'snare':
                    return 'D4';
                case 'hihat':
                    return 'E4';
                case 'ohihat':
                    return 'F4';
                case 'lowtom':
                    return 'G4';
                case 'hitom':
                    return 'A4'
                case 'conga1':
                    return 'G4'
                case 'conga2':
                    return 'A4'
                default:
                    return 'C4'
            }
        }

        if (newRef.current[track].length === 0) {
            checkAndMakeSteps([track])
        }

        if (newRef.current[track][index]?.note !== '') {
            newRef.current[track].splice(index, 1, { time: `0:0:0`, note: '' })
        } else {
            newRef.current[track].splice(index, 1, { time: `${bars}:${qNotes}:0`, note: [trackNotes(track)], noteLen: "4n", velocity: 1 })
        }

        setValue(`drums.${track}`, newRef.current[track])
    }

    return (
        <div className={styles.sequencerGrid}>
            <div className={styles.sequencerGridStepContainer}>
                <StepBoxes drumSteps={drumSteps} selectedKit={selectedKit} handleKickChange={handleKickChange} register={register} />
            </div>

            <div className={styles.makeDrumsButton}>
                <Button onClick={makeDrums} label="Make Drums" />
            </div>

            <div className={styles.control}>
                <DrumControls
                    changeDrumRate={(rate) => changeDrumRate(rate)}
                    changeDrumSteps={changeDrumSteps}
                    data={watch(`drums`)}
                    index={0}
                    register={register}
                    setSelectedKit={setSelectedKit}
                />
            </div>

            <div className={styles.effects}>
                <DrumEffects
                    disabled
                    index="drums"
                    partData={drumRef.current}
                    tone={tone}
                />
            </div>
        </div>
    )
}

export default Sequencer;