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
 


  // const noteLens = ["1n", "2n", "4n", "8n"]


  // console.log(Progression.fromRomanNumerals("C", progs[0]))

  const playNotes = () => {
    Tone.Transport.bpm.value = 120;
    const now = Tone.now();

    const synth = new Tone.PolySynth(Tone.FMSynth).toDestination()

    // const chordToPlay = stateChords[getRand(0, Object.keys(stateChords).length)].notes
    // const withOct = chordToPlay.map((c, i) => c = c + (i === chordToPlay.length - 1 ? 4 : 3))

    

    // const slimOct = [];
    // // if (withOct.length > 3) {
    //   const amountToGet = 3;
    //   for (let i = 1; i <= amountToGet; i += 1) {
    //     slimOct.push(withOct[getRand(0, withOct.length)])
    //   }
    // // }

    // console.log('slimOct:', slimOct)

    // stateChords.map((s, i) => {
    //   // console.log('s.notes:', s.notes + 3)
    //   synth.triggerAttackRelease(s.notes + 3, "2n", now)
    // })

    // const makeBars = () => {}

    // makeLoop({ notes: withOct, len: "2n"})

    // console.log('chordToPlay:', chordToPlay)
    // console.log('withOct:', withOct)
    
    stateChords.map(c => {
      synth.triggerAttackRelease(c.notes, c.noteData.name, c.timeBar)
    })
    

    // const loop01 = new Tone.Loop((time) => {

    //   synth.triggerAttackRelease(slimOct, "4n")
    // }).start("0:0:0").stop('1:0:0')

    Tone.Transport.start()
    // introLoop()
    // synth.triggerAttackRelease(withOct[1], "2n", now + 1)
    // synth.triggerAttackRelease(withOct[2], "2n", now + 2)
    // synth.triggerAttackRelease(withOct[3], "2n", now + 3)
  }

  return (
    <div className="App">
      <Button onClick={() => getKeyData(allNotes[getRand(0, allNotes.length)], "major")} label="Get Data" />
      <Button onClick={playNotes} label="Play Notes" />
      <br />
      <Button onClick={() => getKeyData(allNotes[getRand(0, allNotes.length)], "major")} label="buildLoop" />
    </div>
  );
}

export default App;
