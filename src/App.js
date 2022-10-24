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
  const [scaleData, setScaleData] = useState({})
  console.log('stateChords:', stateChords)
  console.log('scaleData:', scaleData)

  const currentScaleData = useRef({})

  const processMinor = (data) => {
    console.log('processMinor data:', data)
  }

  /**
   * buildLoop()
   * @param {array} data 
   * @param {number} unisonNotes
   * @param {number} maxBars
   * @param {number} loopTimes
   * @returns 
   */
  const handleBuildLoop = (data) => {
    console.log('buildLoop:', data)
    const currentLoop = buildLoop(data, 1, 4, 1)
    // tempChords.current = currentLoop
    setStateChords(currentLoop.partData)
    setScaleData(currentLoop.scaleData)
    currentScaleData.current = currentLoop.scaleData
    setValue("editedJson", JSON.stringify(currentLoop.partData, null, 2))
  }
  const getKeyData = (tonic, scale) => scale === "major" ? handleBuildLoop(Key.majorKey(tonic)) : processMinor(Key.minorKey(tonic))

  const playNotes = () => {
    Tone.Transport.bpm.value = 120;

    // const synth = new Tone.DuoSynth().toDestination()

    Tone.loaded().then(() => {
      stateChords.map(c => {
        Tone.Transport.schedule((time) => {
          piano01.triggerAttackRelease(c.notes, c.noteData.name)
        }, c.tBar)
      })
    })
  }

  const startTransport = () => {
    Tone.start();
    Tone.Transport.start()
  }

  const pauseTransport = () => {
    const currentTime = Tone.Transport.now()
    Tone.Transport.pause(currentTime + 0.4)
  }

  const stopTransport = () => {
    Tone.Transport.stop()
  }

  const logTime = () => {
    const currentTime = Tone.Transport.now()
    const position = Tone.Transport.position
    console.log("currentTime:", currentTime)
    console.log('propositiongress:', position)
  }

  const onSubmit = (data) => {
    Tone.Transport.clear()
    Tone.Transport.cancel()
    setStateChords(JSON.parse(data.editedJson))

    Tone.loaded().then(() => {
      JSON.parse(data.editedJson).map(c => {
        Tone.Transport.schedule((time) => {
          piano01.triggerAttackRelease(c.notes, c.noteData.name)
        }, c.tBar)

      })
    })

  }

  return (
    <div className="App">
      <Button onClick={() => getKeyData(allNotes[getRand(0, allNotes.length)], "major")} label="buildLoop" />
      <Button onClick={playNotes} label="Play Notes" />
      <Button onClick={logTime} label="Log Time" />


      <br />
      <Button onClick={startTransport} label="Start Transport" />
      <Button onClick={stopTransport} label="Stop Transport" />
      <Button onClick={pauseTransport} label="Pause Transport" />

      <br />
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea cols="50" rows="20" defaultValue={stateChords.length ? stateChords : ""} {...register("editedJson")} style={{ fontSize: 10 }} />
        <br />
        <Button type="submit" label="update stateChords" />
      </form>

      <p>
        <strong>{scaleData?.name}</strong>
      </p>

    </div>
  );
}

export default App;
