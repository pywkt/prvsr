import React, { useState, useRef } from 'react';
import * as Tone from 'tone';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import Button from '../Button';
import { kit8 } from '../../instruments/drums/kit8';

const Sequencer = ({ setDrumPart }) => {
    const kickArr = []
    const { register, handleSubmit, setValue, control, reset, getValues } = useForm();
    const { fields, append, remove, update } = useFieldArray({ control, name: "drums" })

    const drumTracks = { parts: ["kick", "snare", "hihat"], steps: 16 }
    const [drumSteps, setDrumSteps] = useState(16)

    const drumStepsRef = useRef(16)
    const kickRef = useRef([])

    const makeDrums = () => {
        // console.log('drums', getValues(`drums`))
        const drumData = getValues(`drums`)
        console.log('drumData:', drumData)
        // const validKicks = kickRef.current.filter(k => k.note !== '')
        // console.log('validKicks:', validKicks)

        // console.log("drumData:", drumData)

        const validKicks = kickRef.current.filter(k => k.note !== '')
        setValue(`drums.kick`, { partData: { ...validKicks }, slug: kit8 })
        // console.log('validKicks:', validKicks)
        // kickRef.current = validKicks

        let position;

        const drumsToSend = { partData: [ ...validKicks ], slug: kit8, name: 'kick' }
        // console.log("drumsToSend:", drumsToSend)


        setDrumPart(drumsToSend)
        // Tone.Transport.scheduleRepeat((time, data) => {
        //     // console.log("seq time:", time)
        //     position = Tone.Transport.position
        //     // console.log('position:', position)

        //     // if (position.split(":")[1] === 0) {
        //     //     console.log("zeao")
        //     // }


        // }, "4n")

        // const loopA = new Tone.Loop(time => {
        //     // synthA.triggerAttackRelease("C2", "8n", time);
        //     kickArr.map((k, i) => {
        //         kit8.triggerAttackRelease(k.note, "4n", k.time)
        //     })
        // }, "4n").start(0);

        // Tone.loaded().then(() => {
        //     kickRef.current.map((k) => {
        //         Tone.Transport.schedule(time => {

        //             kit8.triggerAttackRelease(k.note, "4n")
        //         }, k.time)
        //     })



        // })

    }

    const changeDrumSteps = (e) => {
        console.log('e:', drumStepsRef.current)
        setDrumSteps(Number(drumStepsRef.current))
    }


    const handleKickChange = (index) => {
        console.log('handleKickChange')
        const bars = String(index / 4).split(".")[0]
        const qNotes = index % 4

        console.log('ref:', kickRef.current.length)

        if (kickRef.current.length === 0) {
            console.log('making kick ref')
            for (let i = 0; i < drumSteps; i += 1) {
                kickRef.current.push({ time: `0:0:0`, note: '' })
            }
        }

        console.log("kickref.current 01", kickRef.current)
        console.log('kickRef index:', index)

        if (kickRef.current[index].note.includes("C4")) {
            console.log('fff')
            kickRef.current.splice(index, 1, { time: `0:0:0`, note: '' })
        } else {
            console.log('www')
            kickRef.current.splice(index, 1, { time: `${bars}:${qNotes}:0`, note: ["C4"], noteLen: "4n", velocity: 1 })
        }

        console.log('kickref.current 02:', kickRef.current)

        setValue("drums", kickRef.current)

        // console.log('measure:', String(index / 4).split(".")[0])
        // console.log("kickRef.current:", kickRef.current)
        // kickRef.current = kickArr

        // const validKicks = kickRef.current.filter(k => k.note !== '')
        // setValue(`drums.kick`, { partData: { ...validKicks }, slug: kit8 })
        // // console.log('validKicks:', validKicks)
        // kickRef.current = validKicks
        // setDrumPart(getValues(`drums`))
    }

    const makeTrackBoxes = (track) => {
        return Array.from(Array(drumSteps)).map((_, i) => <input {...register(`${track}`)} onChange={() => handleKickChange(i)} key={`${track}-${i}`} type="checkbox" id={`${track}-step-${i}`} />)
    }


    return (
        <div>
            {makeTrackBoxes('kick')}
            <br />
            <input type="text" onChange={(e) => drumStepsRef.current = e.target.value} defaultValue={16} />
            <Button onClick={changeDrumSteps} label="Update" />
            <br />
            <Button onClick={makeDrums} label="Make Drums" />

        </div>
    )
}

export default Sequencer;