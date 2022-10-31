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

    const drumStepsRef = useRef(16);
    const kickRef = useRef([]);
    const snareRef = useRef([]);
    const drumRef = useRef([])
    const newRef = useRef({kick: [], snare: [], hihat: []});

    const makeDrums = () => {
        // console.log('drums', getValues(`drums`))
        const drumData = getValues(`drums`)
        console.log('drumData:', drumData)

        const drumParts = Object.keys(drumData)
        console.log('drumParts:', drumParts)
        // const validKicks = kickRef.current.filter(k => k.note !== '')
        // console.log('validKicks:', validKicks)

        // console.log("drumData:", drumData)

        // const validKicks = kickRef.current.filter(k => k.note !== '')
        // const validHits = drumData.filter(k => k.note !== '')
        const allDrums = []
        drumParts.map((d, i) => {
            allDrums.push(drumData[d].filter(a => a.note !== ''))
            drumRef.current[d] = { partData: [ ...allDrums[i].map(ad => ad) ], slug: kit8, name: d }
        })
        console.log('allDrums:', allDrums)
        console.log('drumRef.current:', drumRef.current)
        // console.log('validHits:', validHits)
        // setValue(`drums.kick`, { partData: { ...validKicks }, slug: kit8 })
        // setValue(`drums`, { partData: { ...validHits }, slug: kit8 })
        // console.log('validKicks:', validKicks)
        // kickRef.current = validKicks

        let position;

        console.log('values:', getValues('drums'))

        // const rhfDrumData = getValues('drums')
        // console.log('rhfDrumData:', rhfDrumData)
        // // const drumsToSend = { partData: [...validHits], slug: kit8, name: 'kick' }
        // const drumsToSend = rhfDrumData.map((rd, i) => {
        //     console.log('mapppp:', rd)
        // })
        // console.log("drumsToSend:", drumsToSend)


        setDrumPart(drumRef.current)
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


    const handleKickChange = (index, track) => {
        console.log('handleKickChange')
        const bars = String(index / 4).split(".")[0]
        const qNotes = index % 4

        // console.log('handle - track:', track)

        // const setTrack = (track) => {
        //     switch (track) {
        //         case 'kick':
        //             return kickRef
        //         case 'snare':
        //             return snareRef
        //     }
        // }

        const trackNotes = (track) => {
            switch (track) {
                case 'kick':
                    return 'C4';
                case 'snare':
                    return 'D4';
                case 'hihat':
                    return 'E4'
            }
        }

        // const aTrack = setTrack(track)

        // console.log('ref:', track, aTrack.current)

        if (newRef.current[track].length === 0) {
            console.log('making kick ref')
            for (let i = 0; i < drumSteps; i += 1) {
                newRef.current[track].push({ time: `0:0:0`, note: '' })
            }
        }

        console.log('newRef:', newRef.current[track])
        // console.log(`01`, aTrack.current)
        // console.log('kickRef index:', index)

        if (newRef.current[track][index].note !== '') {
            // console.log('fff')
            newRef.current[track].splice(index, 1, { time: `0:0:0`, note: '' })
        } else {
            // console.log('www')
            newRef.current[track].splice(index, 1, { time: `${bars}:${qNotes}:0`, note: [trackNotes(track)], noteLen: "4n", velocity: 1 })
        }

        // console.log('kickref.current 02:', aTrack.current)

        setValue(`drums.${track}`, newRef.current[track])

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
        return Array.from(Array(drumSteps)).map((_, i) => <input {...register(`${track}`)} onChange={() => handleKickChange(i, track)} key={`${track}-${i}`} type="checkbox" id={`${track}-step-${i}`} />)
    }


    return (
        <div>
            {makeTrackBoxes('kick')}
            <br />
            {makeTrackBoxes('snare')}
            <br />
            {makeTrackBoxes('hihat')}
            <br />
            <input type="text" onChange={(e) => drumStepsRef.current = e.target.value} defaultValue={16} />
            <Button onClick={changeDrumSteps} label="Update" />
            <br />
            <Button onClick={makeDrums} label="Make Drums" />

        </div>
    )
}

export default Sequencer;