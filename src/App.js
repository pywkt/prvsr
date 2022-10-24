import React, { useState, useRef } from 'react';
import { Chord, Key, Note, Progression, Scale } from '@tonaljs/tonal';
import * as Tone from 'tone';
import { useForm } from 'react-hook-form';
import './App.css';
import Button from './components/Button';
import { piano01 } from './instruments/piano01'
import { allNotes, buildLoop, getRand, processMajor } from './util';

function App() {
  const { register, handleSubmit, setValue } = useForm();
  
  const [stateChords, setStateChords] = useState([])
  console.log('state:', stateChords)

  const tempChords = useRef([])

  const processMinor = (data) => {
    console.log('processMinor data:', data)
  }

  // const getKeyData = (tonic, scale) => scale === "major" ? setChords(Key.majorKey(tonic)) : processMinor(Key.minorKey(tonic))

  // const setChords = (data) => setStateChords(processMajor(data))

  /**
   * buildLoop()
   * @param {array} data 
   * @param {number} unisonNotes
   * @param {number} maxBars
   * @param {number} loopTimes
   * @returns 
   */
  const handleBuildLoop = (data) => {
    const currentLoop = buildLoop(data, 3, 1, 1)
    // tempChords.current = currentLoop
    setStateChords(currentLoop)
    setValue("editedJson", JSON.stringify(currentLoop, null, 2))
  }
  const getKeyData = (tonic, scale) => scale === "major" ? handleBuildLoop(Key.majorKey(tonic)) : processMinor(Key.minorKey(tonic))

  const stopTransport = () => Tone.Transport.stop()

  const playNotes = () => {
    Tone.Transport.bpm.value = 120;
    const now = Tone.now();

    // const synth = new Tone.DuoSynth().toDestination()
    // const synth = new Tone.PolySynth(Tone.MonoSynth, {
    //   oscillator: {
    //     type: "am"
    //   },
    //   envelope: {
    //     attack: 0.0
    //   }
    // }).toDestination();

    // const notes = (time) => stateChords.map(c => {
    //     return piano01.triggerAttackRelease(c.notes, c.noteData.name, c.timeBar)
    //   })

    //   console.log('notes:', notes())

    Tone.loaded().then(() => {

      stateChords.map(c => {
        console.log(c)
        piano01.triggerAttackRelease(c.notes, c.noteData.name, c.tBar)
      })

      // const loop = stateChords.map(c => {
      //   console.log(c)
      //   piano01.triggerAttackRelease(c.notes, c.noteData.name, c.tBar)
      // })

      // const notes = () => stateChords.map(c => {
      //   return piano01.triggerAttackRelease(c.notes, c.noteData.name, c.timeBar)
      // })
      // console.log('notes:', notes())

    })



    Tone.start()
    // loop01.start();
    // Tone.Transport()
    // loop01.start()
  }

  const startTransport = () => Tone.start()

  // const updateTempChords = (e) => {
  //   console.log("temp:" ,e.target.value)
  //   tempChords.current = JSON.stringify(e).target.value
  //   setValue("editedJson", e.target.value)
  // }

  const onSubmit = (data) => {
    console.log(data.editedJson)
    setStateChords(JSON.parse(data.editedJson))
  }

  return (
    <div className="App">
      <Button onClick={() => getKeyData(allNotes[getRand(0, allNotes.length)], "major")} label="Get Data" />
      <Button onClick={playNotes} label="Play Notes" />
      <br />
      <Button onClick={() => getKeyData(allNotes[getRand(0, allNotes.length)], "major")} label="buildLoop" />
      <Button onClick={startTransport} label="start Transport" />

      <br />
      <form onSubmit={handleSubmit(onSubmit)}>
      <textarea cols="50" rows="20" defaultValue={stateChords.length ? stateChords : ""} {...register("editedJson")} style={{ fontSize: 10 }}/>
      <br />
      <Button type="submit" label="update stateChords" />
      </form>
      
    </div>
  );
}

export default App;
