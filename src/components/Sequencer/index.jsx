import React, { useState, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import Button from '../Button';
import StepBoxes from './StepBoxes';
import KitSelector from './KitSelector';
import ChannelControls from '../ChannelControls';
import { allDrumKits } from '../../instruments/drums';
import styles from '../../styles/Sequencer.module.scss';

const Sequencer = ({ setDrumPart }) => {
    const { register, setValue, control, getValues, watch } = useForm();
    useFieldArray({ control, name: "drums" })

    const [drumSteps, setDrumSteps] = useState(16)
    const [selectedKit, setSelectedKit] = useState(allDrumKits[0])

    const drumStepsRef = useRef(16);
    const drumRef = useRef([])
    const newRef = useRef({ kick: [], snare: [], hihat: [], ohihat: [], lowtom: [], hitom: [] });

    const makeDrums = () => {
        const drumData = getValues(`drums`)
        const drumParts = Object.keys(drumData)

        const fff = drumParts.filter(d => d !== 'startTime' && d !== 'channel')
        const allDrums = []
        fff.map((d, i) => {
            allDrums.push(drumData[d].filter(a => a.note !== ''))
            return drumRef.current[d] = { partData: [...allDrums[i].map(ad => ad)], slug: selectedKit.instrument.kit, channel: selectedKit.instrument.channel, name: d, startTime: drumData.startTime, type: 'drum' }
        })

        setValue(`drums.channel`, selectedKit.instrument.channel)

        setDrumPart(drumRef.current, drumSteps)
    }

    const changeDrumSteps = (e) => {
        setDrumSteps(Number(drumStepsRef.current))
    }

    const checkAndMakeSteps = (track) => {
        if (newRef.current[track]?.length === 0) {
            for (let i = 0; i < drumSteps; i += 1) {
                newRef.current[track].push({ time: `0:0:0`, note: '' })
            }
        }
    }


    const handleKickChange = (index, track) => {
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
                default:
                    return 'C4'
            }
        }

        checkAndMakeSteps([track])

        if (newRef.current[track][index].note !== '') {
            newRef.current[track].splice(index, 1, { time: `0:0:0`, note: '' })
        } else {
            newRef.current[track].splice(index, 1, { time: `${bars}:${qNotes}:0`, note: [trackNotes(track)], noteLen: "4n", velocity: 1 })
        }

        setValue(`drums.${track}`, newRef.current[track])
    }

    // const makeTrackBoxes = (track) => {
    //     return Array.from(Array(drumSteps)).map((_, i) =>
    //         <input {...register(`${track}`)} onChange={() => handleKickChange(i, track)} key={`${track}-${i}`} type="checkbox" id={`${track}-step-${i}`} />)
    // }

    // const handleSelection = (e) => {
    //     setSelectedKit(allDrumKits[e.target.value])
    // }

    return (
        <div>

            <StepBoxes drumSteps={drumSteps} selectedKit={selectedKit} handleKickChange={handleKickChange} register={register} />
            <br />
            <KitSelector setSelectedKit={setSelectedKit} />


            <br />
            {/* <select onChange={handleSelection}>
                {allDrumKits.map((item, index) => (
                    <option value={index} key={`${item.name}-${index}`} label={item.name} />
                ))}
            </select> */}
            <br />

            <ChannelControls index={0} data={watch('drums')} />

            <br />

            <input defaultValue={0} type="text" id="start-time-bar-drums" {...register(`drums.startTime.bar`)} style={{ width: 30, margin: 5 }} />
            <span>:</span>
            <input defaultValue={0} type="text" id="start-time-bar-drums" {...register(`drums.startTime.beat`)} style={{ width: 30, margin: 5 }} />
            <br />

            <input type="text" onChange={(e) => drumStepsRef.current = e.target.value} defaultValue={16} />
            <Button onClick={changeDrumSteps} label="Update" />
            <br />
            <Button onClick={makeDrums} label="Make Drums" />

        </div>
    )
}

export default Sequencer;