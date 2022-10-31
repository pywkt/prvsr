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
  // console.log('stateChords:', stateChords)

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
    // console.log('build:', partData)
    const currentLoop = buildLoop(!currentScaleData.current ? data : currentScaleData.current, partData.unisonCount, 4, 4, partData.notesToUse, partData.octave)
    const rhfData = getValues(`instrumentArray`)

    // setStateChords(rhfData)
    setScaleData(currentLoop.scaleData)
    return currentLoop
  }

  const getKeyData = (tonic, scale, partData) =>
    scale === "major" ? handleBuildLoop(Key.majorKey(tonic), partData) : processMinor(Key.minorKey(tonic))


  const drumsRef = useRef([])
  // console.log('drumsRef:', drumsRef.current)




  const makeInstrument = () => {
    Tone.Transport.bpm.value = 120;

    Tone.loaded().then(() => {
      console.log('*** stateChords:', stateChords)

      stateChords.map((sc, sci) => {
        return new Tone.Part(((time, value) => {
          const instrument = stateChords[sci].slug
          console.log('instrument:', instrument)
          console.log('value:', value)

          instrument.triggerAttackRelease(value.note, value.noteLen, time, value.velocity);
        }), sc.partData).start(0)
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
    const position = Tone.Transport.position
    console.log('position:', position)
  }

  const instruments = [{ name: "", slug: "" }, { name: "Synth 01", slug: "synth01" }, { name: "Piano 01", slug: "piano01" }]
  const drums = [{ name: "kit8", slug: "kit8" }]
  const notesToUse = ['1n', '2n', '4n', '8n', '16n']



  const onSubmit = async (data) => {
    // console.log('onSubmit 01:', data)
    // Tone.Transport.cancel()
    // Tone.Transport.clear()

    // await data.forEach(async (dd, index) => {
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

    //   const newData = Object.keys(currentScaleData.current).length === 0 ?
    //     await getKeyData(allNotes[getRand(0, allNotes.length)], "major", { ...dd, notesToUse: validNotes }) :
    //     await getKeyData(currentScaleData.current.tonic, "major", { ...dd, notesToUse: validNotes })

    //   setValue(`instrumentArray.${index}.slug`, getInstrumentData())
    //   setValue(`instrumentArray.${index}.data`, newData)

    //   const cleanPartData = {
    //     times: await newData.partData.map(o => o.tBar),
    //     notes: await newData.partData.map(o => o.notes),
    //     noteNames: await newData.partData.map(o => o.noteData.name)
    //   }

    //   const newPartData = []
    //   // Make an array of objects that will fit nicely in to Tone.Part
    //   Object.keys(cleanPartData.times).forEach((f, i) => newPartData.push({
    //     time: cleanPartData.times[i],
    //     note: cleanPartData.notes[i],
    //     noteLen: cleanPartData.noteNames[i],
    //     velocity: Number(`0.${getRand(60, 99)}`)
    //   }))

    //   setValue(`instrumentArray.${index}.partData`, newPartData)
    // })

    // const rhfValues = getValues(`instrumentArray`)
    // console.log('rhfValues:', rhfValues)

    // setStateChords(getValues(`instrumentArray`))
  }


  const buildIndividualPart = async (data, index) => {
    console.log('onSubmit 01:', data)
    // Tone.Transport.cancel()
    // Tone.Transport.clear()

    const slug = instruments.find(i => i.slug === data.instrument).slug

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

    const validNotes = Object.keys(data.notesToUse).filter(k => data.notesToUse[k] === true);

    const newData = Object.keys(currentScaleData.current).length === 0 ?
      await getKeyData(allNotes[getRand(0, allNotes.length)], "major", { ...data, notesToUse: validNotes }) :
      await getKeyData(currentScaleData.current.tonic, "major", { ...data, notesToUse: validNotes })

    setValue(`instrumentArray.${index}.slug`, getInstrumentData())
    setValue(`instrumentArray.${index}.data`, newData)

    const cleanPartData = {
      times: await newData.partData.map(o => o.tBar),
      notes: await newData.partData.map(o => o.notes),
      noteNames: await newData.partData.map(o => o.noteData.name)
    }

    const newPartData = []
    // Make an array of objects that will fit nicely in to Tone.Part
    Object.keys(cleanPartData.times).forEach((f, i) => newPartData.push({
      time: cleanPartData.times[i],
      note: cleanPartData.notes[i],
      noteLen: cleanPartData.noteNames[i],
      velocity: Number(`0.${getRand(60, 99)}`)
    }))

    setValue(`instrumentArray.${index}.partData`, newPartData)

    return getValues(`instrumentArray.${index}`)

    // const rhfValues = getValues(`instrumentArray`)
    // console.log('rhfValues:', rhfValues)

    // setStateChords(getValues(`instrumentArray`))
  }




  // const refreshPart = async (index) => {
  //   console.log('refresh')
  //   let newData;

  //   const data = getValues(`instrumentArray.${index}`)
  //   console.log('refresh data:', data.instrumentArray[index])
  //   console.log(getValues(`instrumentArray.${index}.data`))

  //   const instrumentToUpdate = data.instrumentArray[index]

  //   const validNotes = Object.keys(instrumentToUpdate.notesToUse).filter(k => instrumentToUpdate.notesToUse[k] === true);

  //   newData = Object.keys(currentScaleData.current).length === 0 ?
  //     await getKeyData(allNotes[getRand(0, allNotes.length)], "major", { ...instrumentToUpdate, notesToUse: validNotes }) :
  //     await getKeyData(currentScaleData.current.tonic, "major", { ...instrumentToUpdate, notesToUse: validNotes })

  //   console.log('newData:', newData)

  //   setValue(`instrumentArray.${index}.data`, newData)
  // }

  const activeParts = useRef({})

  const addToTransport = (data, index) => {
    Tone.Transport.bpm.value = 120;
    console.log('addToTransport start:', data)
    console.log('add index:', index)
    // const data = getValues(dataName)
    // console.log("data.length:", data.length)

    // const numberOfParts = data.length
    // console.log("numberOfParts:", numberOfParts)

    // if (numberOfParts !== data.length) {
    //   // console.log("ppp")
    //   activeParts.current = {...activeParts.current, [numberOfParts + 1]: numberOfParts + 1 }
    // }
    

    // console.log("activeParts", activeParts.current)

    Tone.loaded().then(() => {
      // console.log('*** stateChords:', stateChords)

      // Tone.Part.clear()
      console.log('add:', data)
      console.log('activeParts before:', activeParts.current)

      if (activeParts.current[index]) {
        console.log('*** disposing')
        activeParts.current[index].dispose()
      }
      


      // data.map((sc, sci) => {
        activeParts.current[index] = new Tone.Part(((time, value) => {
          const instrument = data.slug
          console.log('instrument:', data.slug)
          // console.log('value:', value)

          instrument.triggerAttackRelease(value.note, value.noteLen, time, value.velocity);
        }), data.partData).start(0)

      if (activeParts.current[index].name !== "Part") {
          console.log("change")
        }

        console.log('active again:', activeParts.current[index])
        activeParts.current[index].name = index

        console.log(data.name)

        if ((typeof data.name) !== 'undefined') {
          console.log('data.name:', data.name)
          activeParts.current[index].loop = true
          activeParts.current[index].loopStart = "0:0:0"
          activeParts.current[index].loopEnd = "4:0:0"
          activeParts.current[index].playbackRate = 2
        }
        console.log("in map:", activeParts.current)
      // })




      // data.map((sc, sci) => {
      //   activeParts.current[index] = new Tone.Part(((time, value) => {
      //     const instrument = sc.slug
      //     console.log('instrument:', data.slug)
      //     console.log('value:', value)

      //     instrument.triggerAttackRelease(value.note, value.noteLen, time, value.velocity);
      //   }), sc.partData).start(0)

      //   if (activeParts.current[sci].name !== "Part") {
      //     console.log("change")
      //   }

      //   activeParts.current[sci].name = index
      //   console.log("in map:", activeParts.current[index])
      // })

      console.log("after:", activeParts.current)

      

      // data.map((sc, sci) => {
      //   return new Tone.Part(((time, value) => {
      //     const instrument = sc.slug
      //     console.log('instrument:', data.slug)
      //     console.log('value:', value)

      //     instrument.triggerAttackRelease(value.note, value.noteLen, time, value.velocity);
      //   }), sc.partData).start(0)
      // })

      // console.log("all transport:", Tone.Transport.cancel())

    })
  }

  const commitInstrument = async (index) => {
    // console.log('index:', index)
    const data = getValues(`instrumentArray.${index}`)
    // console.log('commit:', data)
    const commited = await buildIndividualPart(data, index)
    // console.log('committed:', commited)

    // setValue(`instrumentArray.${index}`, commited)

    // await addToTransport(`instrumentArray`, index)
    await addToTransport(commited, index)


  }

  const deletePart = (index) => {
    console.log(activeParts.current[index])
    activeParts.current[index].dispose()
    delete activeParts.current[index];
    remove(index)
  }

  const setDrumPart = async (data) => {
    console.log('setDrumPart:', data)
    
    // if (activeParts.current[data.name]) {
    //   activeParts.current[data.name].dispose()
    //   delete activeParts.current[data.name]
    //   remove(data.name)
    // }


    // drumsRef.current = data
    // console.log(typeof data)
    // const dataArr = [data]

    // Tone.loaded().then(() => {
    //   Object.entries(data).map((sc, sci) => {
    //     console.log('sc drums:', sc[1])
    //     return new Tone.Part(((time, value) => {
    //       const instrument = sc.slug
    //       console.log('instrument:', data.slug)
    //       console.log('value:', value)

    //       instrument.triggerAttackRelease(value.note, value.noteLen, time, value.velocity);
    //     }), sc.partData).start(0)
    //   })
    // })

    for (const [key, value] of Object.entries(data)) {
      await addToTransport(value, key, true)
    }

    // Object.entries(data).map(async dp => {
    //   await addToTransport(dp, dp.name, true)
    // })
    

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
              <br />
              <label htmlFor='unison-count'>Notes to play at once</label>
              <br />
              <input defaultValue="1" type="text" id='unison-count' {...register(`instrumentArray.${index}.unisonCount`)} />
              <br />
              <label htmlFor='octave-input'>octave</label>
              <br />
              <input defaultValue={3} type="text" id="octave-input" {...register(`instrumentArray.${index}.octave`)} />

              {/* <button type="button" onClick={() => refreshPart(index)}>Refresh</button> */}

              <div>
                {notesToUse.map(n => (
                  <span key={n}>
                    <label htmlFor={n}>{n}</label>
                    <input name={n} type="checkbox" {...register(`instrumentArray.${index}.notesToUse.${n}`)} id={n} />
                  </span>
                ))}
              </div>

              <Button onClick={() => commitInstrument(index)} type='button' label="Add to Track" />
              <button type="button" onClick={() => deletePart(index)}>Delete</button>

              <hr style={{ width: 400 }} />
            </li>
          ))}


        </ul>
        <button
          type="button"
          onClick={() => { append({ instrument: selectedInstrument, data: [] }) }}
        >
          Add Instrument
        </button>
        {/* <input type="submit" /> */}
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
        <li>click Add to Track</li>
        <li>use start/stop to start and stop the timeline</li>
      </ol>
      {/* <hr /> */}
      <ul style={{ textAlign: 'left' }}>
        <li>stop the transport before updating the instruments</li>
      </ul>
    </div>
  );
}

export default App;
