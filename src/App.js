import React, { useState, useRef } from 'react';
import { Key } from '@tonaljs/tonal';
import * as Tone from 'tone';
import { useForm, useFieldArray } from 'react-hook-form';
import Header from './components/Header';
import Button from './components/Button';
import Sequencer from './components/Sequencer';
import ChannelControls from './components/ChannelControls';
import Effects from './components/Effects';
import InstrumentMods from './components/InstrumentMods';
import { piano01 } from './instruments/piano01'
import { synth01 } from './instruments/synth01'
import { monoSynth } from './instruments/monoSynth';
import { fmSynth } from './instruments/fmSynth';
import { allNotes } from './config';
import { buildLoop, getRand } from './util';
import styles from './styles/App.module.scss';

function App() {
  const { register, handleSubmit, setValue, control, getValues, watch } = useForm({
    defaultValues: {
      instrumentArray: {
        songData: {
          bpm: 120,
          swing: 0
        }
      }
    }
  });
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
    // console.log('partData:', partData)
    currentScaleData.current = data
    const currentLoop = buildLoop(!currentScaleData.current ? data : currentScaleData.current, Number(partData.unisonCount), Number(partData.maxBars), Number(partData.numberOfLoops), partData.notesToUse, partData.octave, partData.startTime)

    setScaleData(currentLoop.scaleData)
    return currentLoop
  }

  const getKeyData = (tonic, scale, partData) =>
    scale === "major" ? handleBuildLoop(Key.majorKey(tonic), partData) : processMinor(Key.minorKey(tonic))

  // const logTime = () => {
  //   const position = Tone.Transport.position
  //   console.log('position:', position)
  //   return position
  // }

  // const startTransport = () => {
  //   Tone.start();
  //   Tone.Transport.start()

  //   Tone.Transport.scheduleRepeat((time) => {
  //     logTime()
  //     setValue(`instrumentData.songData.time`)
  //   }, "4n")
    
  // }

  // const pauseTransport = () => {
  //   const currentTime = Tone.Transport.now()
  //   Tone.Transport.pause(currentTime + 0.4)
  // }

  // const stopTransport = () => {
  //   Tone.Transport.stop()
  // }

 

  // Move to a config file
  const instruments = [
    { name: "", slug: "" },
    { name: "Synth 01", slug: "synth01", type: 'synth' },
    { name: "MonoSynth", slug: "monoSynth", type: 'monoSynth' },
    { name: "FMSynth", slug: "fmSynth", type: 'fmSynth' },
    { name: "Piano 01", slug: "piano01", type: 'piano' }
  ]
  const notesToUse = ['1n', '2n', '4n', '8n', '16n']

  const onSubmit = async (data) => {

  }

  const buildIndividualPart = async (data, index) => {
    console.log('onSubmit 01:', data)

    const slug = instruments.find(i => i.slug === data.instrument)
    console.log('slug:', slug)

    const getInstrumentData = () => {
      switch (slug.type) {
        case 'piano':
          return piano01(index)
        case 'synth':
          return synth01(index)
        case 'monoSynth':
          return monoSynth(index)
        case 'fmSynth':
          return fmSynth(index)
        default:
          return 'piano01-default'
      }
    }

    const inst = await getInstrumentData()[`${slug.type}-${index}`]
    console.log('*** inst:', inst)


    const validNotes = Object.keys(data.notesToUse).filter(k => data.notesToUse[k] === true);

    const newData = Object.keys(currentScaleData.current).length === 0 ?
      await getKeyData(allNotes[getRand(0, allNotes.length)], "major", { ...data, notesToUse: validNotes }) :
      await getKeyData(currentScaleData.current.tonic, "major", { ...data, notesToUse: validNotes })

    setValue(`instrumentArray.${index}.slug`, inst[slug.type])
    setValue(`instrumentArray.${index}.channel`, inst.channel)
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

  // console.log('bpm:', watch(`instrumentArray.songData.bpm`))

  const activeParts = useRef({})

  const addToTransport = async (data, index, steps) => {
    // Tone.Transport.bpm.value = 120
    // Tone.Transport.bpm.value = watch(`instrumentArray.songData.bpm`);

    Tone.loaded().then(async () => {

      if (activeParts.current[index]) {
        activeParts.current[index].dispose()
      }

      activeParts.current[index] = await new Tone.Part(((time, value) => {
        const instrument = data.slug
        const isMono = /monoSynth/.test(instrument.name)
        const isFM = /fmSynth/.test(instrument.name)
        // console.log('instrument:', instrument)

        instrument.triggerAttackRelease(isMono || isFM ? value.note[0] : value.note, value.noteLen, time, value.velocity);
      }), data.partData).start(`${data.startTime.bar}:${data.startTime.beat}:0`)

      // console.log('prob:', data)

      activeParts.current[index].probability = Number(data.probability)


      if ((data.type) === 'drum') {
        activeParts.current[index].loop = true
        activeParts.current[index].loopStart = "0:0:0"
        activeParts.current[index].loopEnd = `${steps / 4}:0:0`
        activeParts.current[index].playbackRate = 2
      }

      setValue(`instrumentArray.${index}.part`, activeParts.current[index])

      delete activeParts[index]

      const fff = getValues(`instrumentArray.${index}`)
      console.log('fff:', fff)
    })
  }

  const commitInstrument = async (index) => {
    // console.log('gv:', getValues(`instrumentArray.${index}`))
    const data = getValues(`instrumentArray.${index}`)
    const commited = await buildIndividualPart(data, index)

    await addToTransport(commited, index)
  }

  const deletePart = (index) => {
    const partToDelete = getValues(`instrumentArray.${index}.part`)
    partToDelete.dispose()
    synth01(index, remove)
    // delete activeParts.current[index];
    remove(index)
  }

  const setDrumPart = async (data, steps) => {
    for (const [key, value] of Object.entries(data)) {
      await addToTransport(value, key, steps)
    }
  }

  const updateBpm = (e) => {
    Tone.Transport.bpm.value = e.target.value
  }

  const updateSwing = (e) => {
    Tone.Transport.swing = e.target.value
  }



  return (
    <div className="App">

      <Header tone={Tone} />

      <div style={{ textAlign: 'center' }}>


        {/* <hr style={{ marginTop: 50 }} />
        <Button onClick={logTime} label="Log Time" />

        <br />
        <Button onClick={startTransport} label="Start" />
        <Button onClick={stopTransport} label="Stop" />
        <Button onClick={pauseTransport} label="Pause" />

        <br /> */}



        <Sequencer setDrumPart={(data, steps) => setDrumPart(data, steps)} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor='song-bpm'>BPM: </label>
          <input type='number' style={{ width: 50 }} defaultValue={120} id='song-bpm' onChange={updateBpm} />
          <label htmlFor='song-swing'>Swing: </label>
          <input type='number' min={0} max={1} step={0.1} style={{ width: 50 }} defaultValue={0} onChange={updateSwing} id='song-swing' />
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
                <br />
                <span htmlFor={`number-of-bars-${index}`} style={{ fontSize: 12 }}>Bars</span>
                <input defaultValue={4} type="text" id={`number-of-bars-${index}`} style={{ width: 30, margin: 10 }} {...register(`instrumentArray.${index}.maxBars`)} />
                <span htmlFor={`number-of-loops-${index}`} style={{ fontSize: 12 }}>Loops</span>
                <input defaultValue={4} type="text" id={`number-of-loops-${index}`} style={{ width: 30, margin: 10 }} {...register(`instrumentArray.${index}.numberOfLoops`)} />

                <br />

                <span htmlFor={`probability-${index}`} style={{ fontSize: 12 }}>Probability</span>

                <input defaultValue={1} type="number" min={0} max={1} step={0.1} id={`probability-${index}`} style={{ width: 30, margin: 10 }} {...register(`instrumentArray.${index}.probability`)} />

                <br />

                {/monoSynth|fmSynth/.test(getValues(`instrumentArray.${index}.instrument`)) &&
                  <InstrumentMods instrument={getValues(`instrumentArray.${index}.slug`)} index={index} />
                }

                <ChannelControls index={index} data={getValues(`instrumentArray.${index}`)} />

                <Effects index={index} partData={getValues(`instrumentArray.${index}`)} disabled={watch(`instrumentArray.${index}.slug`)} tone={Tone} />

                <div>
                  {notesToUse.map(n => (
                    <span key={n}>
                      <label htmlFor={`notes-to-use-${n}-${index}`}>{n}</label>
                      <input name={n} type="checkbox" {...register(`instrumentArray.${index}.notesToUse.${n}`)} id={`notes-to-use-${n}-${index}`} />
                    </span>
                  ))}
                </div>

                <Button onClick={() => commitInstrument(index)} type='button' label="Add to Track" />
                <button type="button" onClick={() => deletePart(index)}>Delete</button>

                <br />

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
      </div>
    </div>

  );
}

export default App;
