import React, { useState, useRef } from 'react';
import { Chord, Key, Note, Progression, Scale } from '@tonaljs/tonal';
import * as Tone from 'tone';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import './App.css';
import Button from './components/Button';
import { piano01 } from './instruments/piano01'
import { synth01 } from './instruments/synth01'
import { allNotes } from './config';
import { buildLoop, getRand } from './util';

function App() {
  const { register, handleSubmit, setValue, control, reset, getValues } = useForm();
  const { fields, append, remove, update } = useFieldArray({ control, name: "instrumentArray" })

  const [stateChords, setStateChords] = useState([])
  const [scaleData, setScaleData] = useState({})
  const [selectedInstrument, setSelectedInstrument] = useState('')
  console.log('stateChords:', stateChords)

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
    const currentLoop = buildLoop(!currentScaleData.current ? data : currentScaleData.current, partData.unisonCount, 4, 2, partData.notesToUse)
    const rhfData = getValues(`instrumentArray`)

    setStateChords(rhfData)
    setScaleData(currentLoop.scaleData)
    return currentLoop
  }

  const getKeyData = (tonic, scale, partData) =>
    scale === "major" ? handleBuildLoop(Key.majorKey(tonic), partData) : processMinor(Key.minorKey(tonic))


  const playNotes = () => {
    Tone.Transport.bpm.value = 120;

    Tone.loaded().then(() => {
      console.log('*** stateChords:', stateChords)

      Tone.start();
      Tone.Transport.start()

      stateChords.map((c, i) => {
        const fff = c.slug
        c.data.partData.map(p => {
          Tone.Transport.schedule((time) => {
            fff.triggerAttackRelease(p.notes, p.noteData.name)
          }, p.tBar)
        })

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
    // Tone.Transport.clear()
    Tone.Transport.cancel()
  }

  const logTime = () => {
    const position = Tone.Transport.position
    console.log('position:', position)
  }

  const [settingsLocked, setSettingsLocked] = useState(true)
  const instruments = [{ name: "", slug: "" }, { name: "Synth 01", slug: "synth01" }, { name: "Piano 01", slug: "piano01" }]
  const notesToUse = ['1n', '2n', '4n', '8n']

  const onSubmit = (data) => {
    console.log('onSubmit:', data)

    data.instrumentArray.forEach(async (dd, index) => {
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
      console.log('validNotes:', validNotes)

      const newData = Object.keys(currentScaleData.current).length === 0 ?
        await getKeyData(allNotes[getRand(0, allNotes.length)], "major", { ...dd, notesToUse: validNotes }) :
        await getKeyData(currentScaleData.current.tonic, "major", { ...dd, notesToUse: validNotes })

      setValue(`instrumentArray.${index}.slug`, getInstrumentData())
      setValue(`instrumentArray.${index}.data`, newData)
    })

    setStateChords(getValues(`instrumentArray`))
    setSettingsLocked(false)
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

    // data.instrumentArray.forEach(async (dd, index) => {
    //   const slug = instruments.find(i => i.slug === dd.instrument).slug

    //   const getInstrumentData = () => {
    //     switch (slug) {
    //       case 'piano01':
    //         return piano01
    //       case 'synth01':
    //         return synth01
    //       default:
    //         return 'piano01-default'
    //     }
    //   }

    //   const validNotes = Object.keys(dd.notesToUse).filter(k => dd.notesToUse[k] === true);
    //   console.log('validNotes:', validNotes)

    //   newData = Object.keys(currentScaleData.current).length === 0 ?
    //     await getKeyData(allNotes[getRand(0, allNotes.length)], "major", { ...dd, notesToUse: validNotes }) :
    //     await getKeyData(currentScaleData.current.tonic, "major", { ...dd, notesToUse: validNotes })

      
    // })

    setValue(`instrumentArray.${index}.data`, newData)
    

    // setValue(`instrumentArray.${index}.slug`, getInstrumentData())
    

    // update(`instrumentArray.data`, "cool")


    
  }

  return (
    <div className="App">
      {/* <Button onClick={() => getKeyData(allNotes[getRand(0, allNotes.length)], "major")} label="buildLoop" /> */}
      <Button onClick={playNotes} label="Play Notes" />
      <Button onClick={logTime} label="Log Time" />


      <br />
      <Button onClick={startTransport} label="Start" />
      <Button onClick={stopTransport} label="Stop" />
      <Button onClick={pauseTransport} label="Pause" />
      {/* <Button onClick={clearTransport} label="Clear" /> */}

      <br />

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


            </li>
          ))}


        </ul>
        <button
          type="button"
          onClick={() => { setSettingsLocked(true); append({ instrument: selectedInstrument, data: [] }) }}
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

    </div>
  );
}

export default App;
