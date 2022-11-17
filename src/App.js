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
import VolumeControl from './components/ChannelControls/VolumeControl';
import MuteButton from './components/ChannelControls/MuteButton';
import SoloButton from './components/ChannelControls/SoloButton';
import UnisonCount from './components/UnisonCount';
import Octave from './components/Octave';
import StartTime from './components/StartTime';
import NumberOfBars from './components/NumberOfBars';
import NumberOfLoops from './components/NumberOfLoops';
import ProbabilityAmount from './components/ProbabilityAmount';
import InstrumentPart from './components/InstrumentPart';
import { piano01 } from './instruments/piano01'
import { synth01 } from './instruments/synth01'
import { monoSynth } from './instruments/monoSynth';
import { fmSynth } from './instruments/fmSynth';
import { allNotes } from './config';
import { buildLoop, getRand } from './util';
import { ReactComponent as Plus } from './icons/plus.svg';
import { ReactComponent as Trash } from './icons/trash.svg';
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
    // console.log('commit:', index)
    const data = getValues(`instrumentArray.${index}`)
    // console.log('data:', data)
    const commited = await buildIndividualPart(data, index)

    await addToTransport(commited, index)
  }

  const deletePart = (index) => {
    const partToDelete = getValues(`instrumentArray.${index}.part`)
    partToDelete.dispose()
    synth01(index, remove)
    remove(index)
  }

  const setDrumPart = async (data, steps) => {
    for (const [key, value] of Object.entries(data)) {
      await addToTransport(value, key, steps)
    }
  }

  // console.log(getValues(`instrumentArray`))

  return (
    <div className="App">

      <Header tone={Tone} />
      <Sequencer setDrumPart={(data, steps) => setDrumPart(data, steps)} />





      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((item, index) => (
          // <InstrumentPart item={item} index={index} instruments={instruments} commitInstrument={() => commitInstrument(index)} deletePart={deletePart} tone={Tone} />
          <div key={item.id} className={styles.instrumentGrid}>

            {/* Instrument Selector */}
            <div className={styles.instrumentSelectorGrid}>
              <select {...register(`instrumentArray.${index}.instrument`)}>
                {instruments.map((i, ind) => (
                  <option value={i.slug} key={i.name}>
                    {i.name}
                  </option>
                ))}
              </select>
              {/* <br /> */}
              {/* <ChannelControls index={index} data={getValues(`instrumentArray.${index}`)} /> */}
              {/* <br /> */}

              <div className={styles.channelControls}>
                <VolumeControl index={index} data={getValues(`instrumentArray.${index}`)} />
                <SoloButton index={index} data={getValues(`instrumentArray.${index}`)} />
                <MuteButton index={index} data={getValues(`instrumentArray.${index}`)} />
              </div>

              
              <div className={styles.notesToUseContainer}>
                <div>Notes to include:</div>
                {notesToUse.map(n => (
                  <div key={n} className={styles.notesToUseCheckboxes}>
                    <label htmlFor={`notes-to-use-${n}-${index}`}>{n}</label>
                    <input name={n} type="checkbox" {...register(`instrumentArray.${index}.notesToUse.${n}`)} id={`notes-to-use-${n}-${index}`} />
                  </div>
                ))}
              </div>

              <div className={styles.partSettings}>
                <UnisonCount index={index} register={register} />
                <Octave index={index} register={register} />
                <StartTime index={index} register={register} />
                <NumberOfBars index={index} register={register} />
                <NumberOfLoops index={index} register={register} />
                <ProbabilityAmount index={index} register={register} />
              </div>
              

              {/* <div className={styles.unisonContainer}>
                <label htmlFor='unison-count'>Notes to play in unison</label>
                <input defaultValue="1" type="number" id='unison-count' {...register(`instrumentArray.${index}.unisonCount`)} />
              </div> */}

              {/* <br /> */}



              <div className={styles.addDeleteContainer}>
                <Button onClick={() => commitInstrument(index)} type='button' label="Add to Track" />
                <button className={styles.trashIcon} type="button" onClick={() => deletePart(index)}><Trash /></button>
              </div>

            </div>



            {/* Instrument Settings */}
            <div className={styles.instrumentControlsGrid}>
              {/* <div className={styles.instrumentControlContainer}>
                <label htmlFor='unison-count'>Notes to play at once</label>
                <input defaultValue="1" type="number" id='unison-count' {...register(`instrumentArray.${index}.unisonCount`)} />
              </div> */}

              {/* <div className={styles.instrumentControlContainer}>
                <label htmlFor='octave-input'>Octave</label>
                <input defaultValue={3} type="number" id="octave-input" {...register(`instrumentArray.${index}.octave`)} />
              </div> */}

              {/* <label htmlFor='unison-count'>Notes to play at once</label>
              <input defaultValue="1" type="text" id='unison-count' {...register(`instrumentArray.${index}.unisonCount`)} />
              <label htmlFor='octave-input'>octave</label>
              <input defaultValue={3} type="text" id="octave-input" {...register(`instrumentArray.${index}.octave`)} />
              <br /> */}
              {/* <div className={styles.instrumentControlContainer}>
                <label htmlFor='start-time-bar-input'>Start Time</label>
                <div>
                  <input defaultValue={0} type="number" id="start-time-bar-input" {...register(`instrumentArray.${index}.startTime.bar`)} style={{ width: 40 }} />
                  <span>:</span>
                  <input defaultValue={0} type="number" id="start-time-beat-input" {...register(`instrumentArray.${index}.startTime.beat`)} style={{ width: 40 }} />
                </div>
              </div> */}

              {/* <div className={styles.instrumentControlContainer}>
                <span htmlFor={`number-of-bars-${index}`}>Bars</span>
                <input defaultValue={4} type="text" id={`number-of-bars-${index}`} style={{ width: 40 }} {...register(`instrumentArray.${index}.maxBars`)} />
              </div> */}

              {/* <div className={styles.instrumentControlContainer}>
                <span htmlFor={`number-of-loops-${index}`}>Loops</span>
                <input defaultValue={4} type="text" id={`number-of-loops-${index}`} style={{ width: 40 }} {...register(`instrumentArray.${index}.numberOfLoops`)} />
              </div> */}

              {/* <div className={styles.instrumentControlContainer}>
                <label htmlFor={`probability-${index}`}>Probability</label>
                <input defaultValue={1} type="number" min={0} max={1} step={0.1} id={`probability-${index}`} style={{ width: 40 }} {...register(`instrumentArray.${index}.probability`)} />
              </div> */}


              <br />

              {/monoSynth|fmSynth/.test(getValues(`instrumentArray.${index}.instrument`)) &&
                <InstrumentMods instrument={getValues(`instrumentArray.${index}.slug`)} index={index} />
              }
            </div>

            {/* Instrument Effects */}
            <div className={styles.instrumentEffectsGrid}>
              <Effects index={index} partData={getValues(`instrumentArray.${index}`)} disabled={watch(`instrumentArray.${index}.slug`)} tone={Tone} />
            </div>

          </div>


        ))}
      </form>

      <div style={{ marginLeft: '2rem' }}>
        <button
          type="button"
          onClick={() => { append({ instrument: 'Synth 01', data: [] }) }}
          className={styles.addInstrumentButton}
        >
          <Plus />
        </button>
      </div>


      <p>
        <strong>{scaleData?.name}</strong>
      </p>
    </div>
    // </div>

  );
}

export default App;
