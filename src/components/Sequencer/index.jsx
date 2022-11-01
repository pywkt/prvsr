import React, { useState, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import Button from '../Button';
import { allDrumKits } from '../../instruments/drums';
// import { kit8 } from '../../instruments/drums/kit8';
// import { sk1, sk1Parts } from '../../instruments/drums/sk1';

const Sequencer = ({ setDrumPart }) => {
    const { register, setValue, control, getValues } = useForm();
    useFieldArray({ control, name: "drums" })

    const [drumSteps, setDrumSteps] = useState(16)

    const [selectedKit, setSelectedKit] = useState(allDrumKits[0])
    console.log('selectedKit:', selectedKit)
    console.log('allKits:', allDrumKits)

    const drumStepsRef = useRef(16);
    const drumRef = useRef([])
    const newRef = useRef({ kick: [], snare: [], hihat: [], ohihat: [], lowtom: [], hitom: [] });

    const makeDrums = () => {
        const drumData = getValues(`drums`)
        console.log('drumData:', drumData)

        const drumParts = Object.keys(drumData)
        console.log('drumParts:', drumParts)

        const fff = drumParts.filter(d => d !== 'startTime')
        console.log('fff:', fff)
        const allDrums = []
        fff.map((d, i) => {
            console.log('d:', d)

            allDrums.push(drumData[d].filter(a => a.note !== ''))
            console.log('allDrums 01:', allDrums)
            return drumRef.current[d] = { partData: [...allDrums[i].map(ad => ad)], slug: selectedKit.instrument, name: d, startTime: drumData.startTime }
        })
        console.log('allDrums:', allDrums)
        console.log('drumRef.current:', drumRef.current)
        console.log('values:', getValues('drums'))

        setDrumPart(drumRef.current)
    }

    const changeDrumSteps = (e) => {
        console.log('e:', drumStepsRef.current)
        setDrumSteps(Number(drumStepsRef.current))
    }

    const checkAndMakeSteps = (track) => {
        if (newRef.current[track]?.length === 0) {
            console.log('making kick ref')
            for (let i = 0; i < drumSteps; i += 1) {
                newRef.current[track].push({ time: `0:0:0`, note: '' })
            }
        }
    }


    const handleKickChange = (index, track) => {
        console.log('handleKickChange')
        const bars = String(index / 4).split(".")[0]
        const qNotes = index % 4

        console.log('track change:', track)

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

        console.log('tracknotes:', trackNotes(track))

        checkAndMakeSteps([track])

        // if (newRef.current[track].length === 0) {
        //     console.log('making kick ref')
        //     for (let i = 0; i < drumSteps; i += 1) {
        //         newRef.current[track].push({ time: `0:0:0`, note: '' })
        //     }
        // }

        if (newRef.current[track][index].note !== '') {
            newRef.current[track].splice(index, 1, { time: `0:0:0`, note: '' })
        } else {
            newRef.current[track].splice(index, 1, { time: `${bars}:${qNotes}:0`, note: [trackNotes(track)], noteLen: "4n", velocity: 1 })
        }

        setValue(`drums.${track}`, newRef.current[track])
    }

    const makeTrackBoxes = (track) => {
        console.log('track:', track)
        return Array.from(Array(drumSteps)).map((_, i) =>
            <input {...register(`${track}`)} onChange={() => handleKickChange(i, track)} key={`${track}-${i}`} type="checkbox" id={`${track}-step-${i}`} />)
    }

    const handleSelection = (e) => {
        setSelectedKit(allDrumKits[e.target.value])
    }


    return (
        <div>

            <hr />

            <select onChange={handleSelection}>
                {allDrumKits.map((item, index) => (
                    <option value={index} key={`${item.name}-${index}`} label={item.name} />
                ))}
            </select>

            <br />
            <div style={{ display: 'flex' }}>
                <div style={{ margin: '0 auto' }}>
                    {selectedKit.parts.map((ad, ind) => (
                        <div key={ad}>
                            <div style={{ margin: '0 auto', textAlign: 'center' }}>
                                <div style={{ textAlign: 'left' }}>
                                    {makeTrackBoxes(ad)} <span style={{ fontSize: 12 }} >{ad}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
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