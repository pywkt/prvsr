import React, { useState, useRef } from 'react';
import { Key } from '@tonaljs/tonal';
import * as Tone from 'tone';
import { useForm, useFieldArray } from 'react-hook-form';
import Header from './components/Header';
import Button from './components/Button';
import Sequencer from './components/Sequencer';
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
import NotesToUse from './components/NotesToUse';
import { piano01 } from './instruments/piano01'
import { synth01 } from './instruments/synth01'
import { monoSynth } from './instruments/monoSynth';
import { amSynth } from './instruments/amSynth';
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
          swing: 0,
          // drumPlaybackRate: 2
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
    { name: "AMSynth", slug: "amSynth", type: 'amSynth' },
    { name: "FMSynth", slug: "fmSynth", type: 'fmSynth' },
    { name: "Piano 01", slug: "piano01", type: 'piano' }
  ]
  // const notesToUse = ['1n', '2n', '4n', '8n', '16n']

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
        case 'amSynth':
          return amSynth(index)
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
    // console.log("data:", data)
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
        const isAM = /amSynth/.test(instrument.name)

        instrument.triggerAttackRelease(isMono || isFM || isAM ? value.note[0] : value.note, value.noteLen, time, value.velocity);
      }), data.partData).start(`${data.startTime.bar}:${data.startTime.beat}:0`)


      activeParts.current[index].probability = Number(data.probability)


      if ((data.type) === 'drum') {
        // console.log("instrumentArray:", getValues(`instrumentArray`))
        // console.log("activeParts:", activeParts.current)
        activeParts.current[index].loop = true
        activeParts.current[index].loopStart = "0:0:0"
        activeParts.current[index].loopEnd = `${steps / 4}:0:0`
        activeParts.current[index].playbackRate = Number(getValues(`instrumentArray.songData.drumPlaybackRate`))
      }

      setValue(`instrumentArray.${index}.part`, activeParts.current[index])

      delete activeParts[index]

      const fff = getValues(`instrumentArray.${index}`)
      console.log('fff:', fff)
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
    synth01(index, remove)
    remove(index)
  }

  const setDrumPart = async (data, steps, drumRate) => {
    // console.log('drumData:', data)
    setValue(`instrumentArray.songData.drumPlaybackRate`, drumRate)
    for (const [key, value] of Object.entries(data)) {
      await addToTransport(value, key, steps)
    }
  }

  return (
    <div className="App">

      <Header tone={Tone} />
      <Sequencer setDrumPart={(data, steps, drumRate) => setDrumPart(data, steps, drumRate)} tone={Tone} />

      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((item, index) => (
          <React.Fragment key={item.id}>
            <h4 className={styles.instrumentGridTitle}>{`${index + 1}: ${getValues(`instrumentArray.${index}.instrument`)}` || ""}</h4>
            <hr className={styles.instrumentGridHr} />
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

                <div className={styles.channelControls}>
                  <VolumeControl index={index} data={getValues(`instrumentArray.${index}`)} />
                  <SoloButton index={index} data={getValues(`instrumentArray.${index}`)} />
                  <MuteButton index={index} data={getValues(`instrumentArray.${index}`)} />
                </div>

                <NotesToUse index={index} register={register} />

                <div className={styles.partSettings}>
                  <UnisonCount index={index} register={register} />
                  <Octave index={index} register={register} />
                  <StartTime index={index} register={register} />
                  <NumberOfBars index={index} register={register} />
                  <NumberOfLoops index={index} register={register} />
                  <ProbabilityAmount index={index} register={register} />
                </div>

                <div className={styles.addDeleteContainer}>
                  <Button onClick={() => commitInstrument(index)} type='button' label="Add to Track" />
                  <button className={styles.trashIcon} type="button" onClick={() => deletePart(index)}><Trash /></button>
                </div>

              </div>

              {/* Instrument Settings */}

              <div className={styles.instrumentControlsGrid}>
                {/monoSynth|fmSynth|amSynth/.test(getValues(`instrumentArray.${index}.instrument`)) &&
                  <InstrumentMods instrument={getValues(`instrumentArray.${index}.slug`)} index={index} />
                }
              </div>


              {/* Instrument Effects */}
              <div className={styles.instrumentEffectsGrid}>
                <Effects index={index} partData={getValues(`instrumentArray.${index}`)} disabled={watch(`instrumentArray.${index}.slug`)} tone={Tone} />
              </div>
            </div>
          </React.Fragment>


        ))}
      </form>

      <hr className={styles.instrumentGridHr} />
      <div style={{ marginLeft: '2rem' }}>
        <button
          type="button"
          onClick={() => { append({ instrument: 'Synth 01', data: [] }) }}
          className={styles.addInstrumentButton}
        >
          Add <Plus />
        </button>
      </div>


      <p>
        <strong>{scaleData?.name}</strong>
      </p>
    </div>

  );
}

export default App;
