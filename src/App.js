import React from 'react'
import { Chord, Key, Note, Progression, Scale } from '@tonaljs/tonal';
import './App.css';
import Button from './components/Button'
import { getRand } from './util';

function App() {
  // console.log("C#:", Note.get("C#"))
  // console.log('Db:', Note.get("Db"))

  const allNotes = ["C", "D", "E", "F", "G", "A", "B", "Cb", "Db", "Eb", "Fb", "Gb", "Ab", "Bb", "C#", "D#", "E#", "F#", "G#", "A#", "B#"]

  // const getKey = (tonic, scale) => {
  //   const res = scale === "major" ? Key.majorKey(tonic) : Key.minorKey(tonic)
  //   console.log("getKey res:", res)
  //   const randomKeyScale = Scale.get(res.chordScales[getRand(0, res.chordScales.length)])
  //   console.log('Key:', res)
  //   console.log('randomKeyScale:', randomKeyScale)

  //   const combinedChords = [...res.chords, ...randomKeyScale.notes]
  //   console.log('combinedChords:', combinedChords)
  //   const chordRes = getChord(combinedChords[getRand(0, combinedChords.length)])

  //   // const chordRes = getChord(randomKeyScale.notes[getRand(0, randomKeyScale.notes.length)])
  //   console.log('chordRes:', chordRes)

  //   const allChordArray = [];
  //   combinedChords.forEach(c => {
  //     const currentChord = Chord.get(c)
  //     allChordArray.push({ name: currentChord.symbol, notes: currentChord.notes })
  //   })

  //   console.log('allChordArray:', allChordArray)
  // }

  // const getChord = (chord) => {
  //   console.log('chord:', chord)
  //   const res = Chord.get(chord)
  //   // console.log('chord res:', res)
  //   return res
  // }

  // const getScales = () => {
  //   const allScales = Scale.names();
  //   const randomScale = allScales[getRand(0, allScales.length)];
  //   const selectedScaleData = Scale.get(randomScale);
  //   const scaleChords = Scale.scaleChords(randomScale);
  //   const scaleReduced = Scale.reduced(randomScale.name)
  //   // const scaleNotes = Scale.scaleNotes(randomScale)

  //   console.log("selectedScaleData:", selectedScaleData)
  //   console.log('scaleChords:', scaleChords)
  //   console.log('scaleReduced:', scaleReduced)

  // }

  const getNotes = () => {
    console.log('ee')
  }

  const processMinor = (data) => {
    console.log('processMinor data:', data)
  }

  const getProgression = () => {

  }

  // Backup
  // const processMajor = (data) => {
  //   console.log('processMajor data:', data)
  //   const { chords } = data

  //   const selectedScale = [];

  //   chords.forEach(chord => {
  //     const currentChord = Chord.get(chord)
  //     // console.log('currentChord:', currentChord)
  //     selectedScale.push({ chord: currentChord.notes, name: currentChord.name, symbol: currentChord.symbol})
  //   })

  //   console.log('selectedScale:', selectedScale)
  // }

  const processMajor = (data) => {
    console.log('processMajor data:', data)
    const { chords, chordScales } = data
    const randScale = chordScales[getRand(0, chordScales.length)]
    console.log('randScale:', randScale)
    // const randScaleChords = Scale.scaleChords(randScale)
    const randScaleData = {...Scale.get(randScale), chords: Scale.scaleChords(randScale)}
    console.log('randScaleData:', randScaleData)

    const chordsToUse = [];
    randScaleData.notes.forEach(note => {
      const currentChord = Chord.getChord(randScaleData.chords[getRand(0, randScaleData.chords.length)], randScaleData.notes[getRand(0, randScaleData.notes.length)])
      chordsToUse.push({ notes: currentChord.notes, symbol: currentChord.symbol, name: currentChord.name})
    })

    console.log('chordsToUse:', chordsToUse)    

  }

  const getKeyData = (tonic, scale) => scale === "major" ? processMajor(Key.majorKey(tonic)) : processMinor(Key.minorKey(tonic))

  return (
    <div className="App">
      <Button onClick={() => getKeyData(allNotes[getRand(0, allNotes.length)], "major")} label="Get Data" />
      {/* <Button onClick={getScales} label="Get Scales" />
      <Button onClick={getNotes} label="Get Notes" />
      <Button onClick={() => getKey(allNotes[getRand(0, allNotes.length)], "major")} label="Get Key" /> */}
    </div>
  );
}

export default App;
