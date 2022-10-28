import React, { useState, useRef } from 'react';
import { Chord, Key, Note, Progression, Scale } from '@tonaljs/tonal';
import * as Tone from 'tone';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import './App.css';
import Button from './components/Button';
import Sequencer from './components/Sequencer';
import { piano01 } from './instruments/piano01'
import { synth01 } from './instruments/synth01'
import { kit8 } from './instruments/drums/kit8';
import { allNotes } from './config';
import { buildLoop, getRand } from './util';

function App() {
  const { register, handleSubmit, setValue, control, reset, getValues } = useForm();
  const { fields, append, remove, update } = useFieldArray({ control, name: "instrumentArray" })

  const [stateChords, setStateChords] = useState([])
  const [scaleData, setScaleData] = useState({})
  const [selectedInstrument, setSelectedInstrument] = useState('')
  const [withDrums, setWithDrums] = useState(false);
  console.log('stateChords:', stateChords)

  const varRef = useRef({})

  const toggleDrums = () => {
    console.log("toggle drums")
  }

  const processMinor = (data) => {
    console.log('processMinor data:', data)
  }

  const currentScaleData = useRef({})

  /**
   * buildLoop()
   * @param {array} data 
   * @param {number} unisonNotes
   * @param {number} maxBars
   * @param {number} loopTimes
   * @returns 
   */
  const handleBuildLoop = async (data, partData) => {
    currentScaleData.current = data
    const currentLoop = buildLoop(!currentScaleData.current ? data : currentScaleData.current, partData.unisonCount, 4, 4, partData.notesToUse)
    const rhfData = getValues(`instrumentArray`)

    // setStateChords(rhfData)
    setScaleData(currentLoop.scaleData)
    return currentLoop
  }

  const getKeyData = (tonic, scale, partData) =>
    scale === "major" ? handleBuildLoop(Key.majorKey(tonic), partData) : processMinor(Key.minorKey(tonic))


  const drumsRef = useRef([])
  // console.log('drumsRef:', drumsRef.current)

  const setDrumPart = (data) => {
    console.log('setDrumPart:', data)
    drumsRef.current = data
  }


  // const makeInstrument = (_, index, data) => {
  //   console.log("makeInstrument:", data)
  //   return new Tone.Part(((time, value) => {
  //     const instrument = data.slug
  //     console.log('value:', value)
  //     console.log('varName:', varRef.current)
  //     instrument.triggerAttackRelease(value.note[0], value.noteLen, time, 1);
  //   }), newArr).start(0)
  // }

  const newArr = []

  const makeInstrument = () => {
    Tone.Transport.bpm.value = 120;
    // Tone.start()
    // Tone.Transport.start()

    Tone.loaded().then(() => {
      console.log('*** stateChords:', stateChords)
      let varName = []

      console.log('length:', Object.keys(stateChords).length)

      // for (let x = 0; x < Object.keys(stateChords).length; x += 1) {
      stateChords.map((sc, sci) => {
        return new Tone.Part(((time, value) => {
          const instrument = stateChords[sci].slug
          console.log('instrument:', instrument)
          console.log('value:', value)
          // the value is an object which contains both the note and the velocity
          instrument.triggerAttackRelease(value.note, value.noteLen, time, 1);
        }), sc.partData).start(0)
      })
      // }






      // stateChords.forEach((sc, sci) => {
      //   console.log('sc:', sc)

      //   varRef.current[sci] = new Tone.Part(((time, value) => {
      //     const instrument = sc.slug
      //     console.log('value:', value)
      //     console.log('varName:', varRef.current)
      //     // the value is an object which contains both the note and the velocity
      //     instrument.triggerAttackRelease(value.note[0], value.noteLen, time, 1);
      //   }), newArr).start(0)

      //   // eslint-disable-next-line
      //   // console.log(varName0)

      //   // part.loop = 4
      //   // part.loopStart = "0:0:0"
      //   // part.loopEnd = "7:3:3"
      // })


      // const part = new Tone.Part(((time, value) => {
      //   const instrument = stateChords[0].slug
      //   console.log('value:', value)
      //   // the value is an object which contains both the note and the velocity
      //   instrument.triggerAttackRelease(value.note[0], value.noteLen, time, 1);
      // }), newArr).start(0);

      // part.loop = 4
      // part.loopStart = "0:0:0"
      // part.loopEnd = "7:3:3"




      // stateChords.map((c, i) => {
      //   const instrument = c.slug
      //   c.data.partData.map(p => {
      //     Tone.Transport.schedule((time) => {
      //       instrument.triggerAttackRelease(p.notes, p.noteData.name)
      //     }, p.tBar)
      //   })
      // })

      // drumsRef.current.map((k) => {
      //   Tone.Transport.schedule(time => {

      //     kit8.triggerAttackRelease(k.note, "4n")
      //   }, k.time)
      // })

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
    // Tone.Transport.clear()
    // Tone.Transport.cancel()
  }

  const logTime = () => {
    const position = Tone.Transport.position
    console.log('position:', position)
  }

  // const [settingsLocked, setSettingsLocked] = useState(true)
  const instruments = [{ name: "", slug: "" }, { name: "Synth 01", slug: "synth01" }, { name: "Piano 01", slug: "piano01" }]
  const drums = [{ name: "kit8", slug: "kit8" }]
  const notesToUse = ['1n', '2n', '4n', '8n']
  const partArr = [];



  const onSubmit = async (data) => {
    console.log('onSubmit 01:', data)
    Tone.Transport.cancel()
    Tone.Transport.clear()

    await data.instrumentArray.forEach(async (dd, index) => {
      const slug = instruments.find(i => i.slug === dd.instrument).slug

      const getInstrumentData = () => {
        switch (slug) {
          case 'piano01':
            return piano01
          case 'synth01':
            return synth01
          default:
            return 'piano01-default'
        }
      }

      const validNotes = Object.keys(dd.notesToUse).filter(k => dd.notesToUse[k] === true);

      const newData = Object.keys(currentScaleData.current).length === 0 ?
        await getKeyData(allNotes[getRand(0, allNotes.length)], "major", { ...dd, notesToUse: validNotes }) :
        await getKeyData(currentScaleData.current.tonic, "major", { ...dd, notesToUse: validNotes })

      setValue(`instrumentArray.${index}.slug`, getInstrumentData())
      setValue(`instrumentArray.${index}.data`, newData)


      const fff = await newData.partData.map(o => o.tBar)
      const www = await newData.partData.map(o => o.notes)
      const ppp = await newData.partData.map(o => o.noteData.name)

      const newPartData = []

      fff.forEach((f, i) => newPartData.push({ time: fff[i], note: www[i], noteLen: ppp[i] }))

      setValue(`instrumentArray.${index}.partData`, newPartData)
    })

    const rhfValues = getValues(`instrumentArray`)
    console.log('rhfValues:', rhfValues)

    setStateChords(getValues(`instrumentArray`))
  }






  const refreshPart = async (index) => {
    console.log('refresh')
    let newData;

    const data = getValues()
    console.log('refresh data:', data.instrumentArray[index])
    console.log(getValues(`instrumentArray.${index}.data`))

    const instrumentToUpdate = data.instrumentArray[index]

    const validNotes = Object.keys(instrumentToUpdate.notesToUse).filter(k => instrumentToUpdate.notesToUse[k] === true);

    newData = Object.keys(currentScaleData.current).length === 0 ?
      await getKeyData(allNotes[getRand(0, allNotes.length)], "major", { ...instrumentToUpdate, notesToUse: validNotes }) :
      await getKeyData(currentScaleData.current.tonic, "major", { ...instrumentToUpdate, notesToUse: validNotes })

    console.log('newData:', newData)

    setValue(`instrumentArray.${index}.data`, newData)
  }



  return (
    <div className="App">
      {/* <Button onClick={() => getKeyData(allNotes[getRand(0, allNotes.length)], "major")} label="buildLoop" /> */}
      <Button onClick={makeInstrument} label="Make Instrument" />
      <Button onClick={logTime} label="Log Time" />


      <br />
      <Button onClick={startTransport} label="Start" />
      <Button onClick={stopTransport} label="Stop" />
      <Button onClick={pauseTransport} label="Pause" />
      {/* <Button onClick={clearTransport} label="Clear" /> */}

      <br />

      {/* <Button onClick={toggleDrums} label="Add Drums" /> */}
      <Sequencer setDrumPart={(data) => setDrumPart(data)} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <ul>


          {fields.map((item, index) => (
            <li key={item.id}>
              <select {...register(`instrumentArray.${index}.instrument`)}>
                {instruments.map((i) => (
                  <option value={i.slug} key={i.name} >
                    {i.name}
                  </option>
                ))}
              </select>

              <input defaultValue="1" type="text" {...register(`instrumentArray.${index}.unisonCount`)} />

              <button type="button" onClick={() => remove(index)}>Delete</button>
              <button type="button" onClick={() => refreshPart(index)}>Refresh</button>

              <div>
                {notesToUse.map(n => (
                  <span key={n}>
                    <label htmlFor={n}>{n}</label>
                    <input name={n} type="checkbox" {...register(`instrumentArray.${index}.notesToUse.${n}`)} id={n} />
                  </span>
                ))}
              </div>

              {/* <Button onClick={(e) => makeInstrument(e, index, getValues(`instrumentArray`))} label="Add to Track" /> */}


            </li>
          ))}


        </ul>
        <button
          type="button"
          onClick={() => { append({ instrument: selectedInstrument, data: [] }) }}
        >
          Add Instrument
        </button>
        <input type="submit" />
      </form>

      {/*
      <form onSubmit={handleSubmit(onSubmit)}>
        <ul>
          {fields.map((item, index) => (
            <li key={item.id}>

              <label htmlFor="instrument-selector">Instrument:</label>
              {/* <select name="instrument-selector" id="instrument-selector" {...register(`instrument.${index}.value`)}>
                {instruments.map((item, index) => (
                  <option value={item.name} key={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>

              <Controller
                render={({ field }) => {
                  console.log("item:", item)
                  console.log('field:', field)
                  return <select name="instrument-selector" id="instrument-selector" >
                    {instruments.map((i) => (
                      <option value={i.name} key={i.name}  {...field}>
                        {i.name}
                      </option>
                    ))}
                  </select>
                }
                }
                name={`instrument.${index}`}
                control={control}
                defaultValue="synth"
              />

              <Button onClick={() => getKeyData(allNotes[getRand(0, allNotes.length)], "major", item.instrument, index)} label="buildLoop" />
              <button type="button" onClick={() => remove(index)}>Delete</button>
            </li>
          ))}
        </ul>

        <button type="button" onClick={() => append(
          {
            instrument: 'synth',
            part: []
          }
        )}
        >
          Append
        </button>
        <input type="submit" />
        </form> */}


      {/* <form onSubmit={handleSubmit(onSubmit)}>
        <textarea cols="50" rows="20" defaultValue={stateChords.length ? stateChords : ""} {...register("editedJson")} style={{ fontSize: 10 }} />
        <br />
        <Button type="submit" label="update stateChords" />
      </form> */}

      <p>
        <strong>{scaleData?.name}</strong>
      </p>

        <ol style={{ textAlign: 'left' }}>
          <li>add instruments</li>
          <li>click submit</li>
          <li>click Make Instrument to add the part to the timeline</li>
          <li>use start/stop to start and stop the timeline</li>
        </ol>
    </div>
  );
}

export default App;
