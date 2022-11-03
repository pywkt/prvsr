import React, { useState, useRef } from 'react';
import { Key } from '@tonaljs/tonal';
import * as Tone from 'tone';
import { useForm, useFieldArray } from 'react-hook-form';
import './App.css';
import Button from './components/Button';
import Sequencer from './components/Sequencer';
import { piano01 } from './instruments/piano01'
import { synth01 } from './instruments/synth01'
import { allNotes } from './config';
import { buildLoop, getRand } from './util';

function App() {
  const { register, handleSubmit, setValue, control, getValues } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: "instrumentArray" })

  const [scaleData, setScaleData] = useState({})

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
    const currentLoop = buildLoop(!currentScaleData.current ? data : currentScaleData.current, partData.unisonCount, 4, 4, partData.notesToUse, partData.octave, partData.startTime)

    setScaleData(currentLoop.scaleData)
    return currentLoop
  }

  const getKeyData = (tonic, scale, partData) =>
    scale === "major" ? handleBuildLoop(Key.majorKey(tonic), partData) : processMinor(Key.minorKey(tonic))

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
  const notesToUse = ['1n', '2n', '4n', '8n', '16n']

  const onSubmit = async (data) => {

  }

  const buildIndividualPart = async (data, index) => {
    console.log('onSubmit 01:', data)

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
  }



  const activeParts = useRef({})

  const addToTransport = async (data, index) => {
    Tone.Transport.bpm.value = 120;
    // console.log('addToTransport start:', data)
    console.log('add index:', index)
    console.log('add - data:', data)
    console.log('add - getValues:', getValues(`instrumentArray.${index}`))

    Tone.loaded().then(async () => {
      console.log('add:', data)
      console.log('activeParts before:', activeParts.current)

      if (activeParts.current[index]) {
        console.log('*** disposing')
        activeParts.current[index].dispose()
      }

      activeParts.current[index] = await new Tone.Part(((time, value) => {
        const instrument = data.slug
        console.log('instrument:', data.slug)

        instrument.triggerAttackRelease(value.note, value.noteLen, time, value.velocity);
      }), data.partData).start(`${data.startTime.bar}:${data.startTime.beat}:0`)

      if ((data.type) === 'drum') {
        console.log('data.name:', data.name)
        activeParts.current[index].loop = true
        activeParts.current[index].loopStart = "0:0:0"
        activeParts.current[index].loopEnd = "4:0:0"
        activeParts.current[index].playbackRate = 2
      }

      setValue(`instrumentArray.${index}.part`, activeParts.current[index])

      delete activeParts[index]

      const fff = getValues(`instrumentArray.${index}`)
      console.log('fff:', fff)
      // if (activeParts.current[index].name !== "Part") {
      //     console.log("change")
      //   }

      //   console.log('active again:', activeParts.current[index])
      //   activeParts.current[index].name = index

      //   console.log(data.name)

      // if ((typeof data.name) !== 'undefined') {
      //   console.log('data.name:', data.name)
      //   activeParts.current[index].loop = true
      //   activeParts.current[index].loopStart = "0:0:0"
      //   activeParts.current[index].loopEnd = "4:0:0"
      //   activeParts.current[index].playbackRate = 2
      // }
      // console.log("in map:", activeParts.current)

      // console.log("after:", activeParts.current)
    })
  }

  const commitInstrument = async (index) => {
    const data = getValues(`instrumentArray.${index}`)
    const commited = await buildIndividualPart(data, index)

    await addToTransport(commited, index)
  }

  const deletePart = (index) => {
    const partToDelete = getValues(`instrumentArray.${index}.part`)
    partToDelete.dispose()
    // delete activeParts.current[index];
    remove(index)
  }

  const setDrumPart = async (data) => {
    console.log('setDrumPart:', data)

    for (const [key, value] of Object.entries(data)) {
      await addToTransport(value, key, true)
    }
  }


  return (
    <div className="App">
      <Button onClick={logTime} label="Log Time" />

      <br />
      <Button onClick={startTransport} label="Start" />
      <Button onClick={stopTransport} label="Stop" />
      <Button onClick={pauseTransport} label="Pause" />

      <br />

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
              <br />
              <input defaultValue={0} type="text" id="start-time-bar-input" {...register(`instrumentArray.${index}.startTime.bar`)} style={{ width: 30, margin: 5 }} />
              :
              <input defaultValue={0} type="text" id="start-time-beat-input" {...register(`instrumentArray.${index}.startTime.beat`)} style={{ width: 30, margin: 5 }} />

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
          onClick={() => { append({ instrument: 'Synth 01', data: [] }) }}
        >
          Add Instrument
        </button>
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
