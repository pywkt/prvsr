import React, { useState } from 'react'
import { Chord, Key, Note, Progression, Scale } from '@tonaljs/tonal';
import * as Tone from 'tone';
import './App.css';
import Button from './components/Button'
import { allNotes, buildLoop, getRand, processMajor } from './util';

function App() {
  const [stateChords, setStateChords] = useState({})
  console.log('state:', stateChords)

  const processMinor = (data) => {
    console.log('processMinor data:', data)
  }

  // const getKeyData = (tonic, scale) => scale === "major" ? setChords(Key.majorKey(tonic)) : processMinor(Key.minorKey(tonic))

  const setChords = (data) => setStateChords(processMajor(data))

  const handleBuildLoop = (data) => setStateChords(buildLoop(data))
  const getKeyData = (tonic, scale) => scale === "major" ? handleBuildLoop(Key.majorKey(tonic)) : processMinor(Key.minorKey(tonic))

  const stopTransport = () => Tone.Transport.stop()

  const playNotes = () => {
    Tone.Transport.bpm.value = 120;
    const now = Tone.now();

    // const synth = new Tone.PolySynth(Tone.FMSynth).toDestination()

    const piano01 = new Tone.Sampler({
      urls: {
        A3: "a-3.mp3",
        A4: "a-4.mp3",
        B3: "b3.mp3",
        B4: "b4.mp3",
        C3: "c-3.mp3",
        C4: "c-4.mp3",
        D3: "d-3.mp3",
        D4: "d-4.mp3",
        E3: "e3.mp3",
        E4: "e4.mp3",
        F3: "f-3.mp3",
        F4: "f-4.mp3",
        G3: "g-3.mp3",
        G4: "g-4.mp3",
      },
      release: 1,
      baseUrl: "http://localhost:3000/samples/",
    }).toDestination();

    Tone.loaded().then(() => {
      stateChords.map(c => {
        piano01.triggerAttackRelease(c.notes, c.noteData.name, c.timeBar)
      })
    })

    // stateChords.map(c => {
    //   synth.triggerAttackRelease(c.notes, c.noteData.name, c.timeBar)
    // })
  }

  return (
    <div className="App">
      <Button onClick={() => getKeyData(allNotes[getRand(0, allNotes.length)], "major")} label="Get Data" />
      <Button onClick={playNotes} label="Play Notes" />
      <br />
      <Button onClick={() => getKeyData(allNotes[getRand(0, allNotes.length)], "major")} label="buildLoop" />
      <Button onClick={stopTransport} label="Stop Transport" />
    </div>
  );
}

export default App;
