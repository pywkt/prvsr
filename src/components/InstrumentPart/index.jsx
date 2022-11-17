import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../Button';
import ChannelControls from '../ChannelControls';
import InstrumentMods from '../InstrumentMods';
import Effects from '../Effects';
import styles from '../../styles/InstrumentPart.module.scss';

const InstrumentPart = ({ item, index, instruments, commitInstrument, deletePart, tone }) => {
    const { register, getValues, setValue, watch } = useForm();
    console.log('index:', index)

    const notesToUse = ['1n', '2n', '4n', '8n', '16n']

    return (
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
                <br />
                <ChannelControls index={index} data={getValues(`instrumentArray.${index}`)} />
                <br />

                <div>
                    {notesToUse.map(n => (
                        <span key={n}>
                            <label htmlFor={`notes-to-use-${n}-${index}`}>{n}</label>
                            <input name={n} type="checkbox" {...register(`instrumentArray.${index}.notesToUse.${n}`)} id={`notes-to-use-${n}-${index}`} />
                        </span>
                    ))}
                </div>

                <br />




                <Button onClick={commitInstrument} type='button' label="Add to Track" />
                <button type="button" onClick={() => deletePart(index)}>Delete</button>
            </div>



            {/* Instrument Settings */}
            <div className={styles.instrumentControlsGrid}>
                <div className={styles.instrumentControlContainer}>
                    <label htmlFor='unison-count'>Notes to play at once</label>
                    <input defaultValue="1" type="number" id='unison-count' {...register(`instrumentArray.${index}.unisonCount`)} />
                </div>
                <div className={styles.instrumentControlContainer}>
                    <label htmlFor='octave-input'>Octave</label>
                    <input defaultValue={3} type="number" id="octave-input" {...register(`instrumentArray.${index}.octave`)} />
                </div>

                {/* <label htmlFor='unison-count'>Notes to play at once</label>
              <input defaultValue="1" type="text" id='unison-count' {...register(`instrumentArray.${index}.unisonCount`)} />
              <label htmlFor='octave-input'>octave</label>
              <input defaultValue={3} type="text" id="octave-input" {...register(`instrumentArray.${index}.octave`)} />
              <br /> */}
                <div className={styles.instrumentControlContainer}>
                    <label htmlFor='start-time-bar-input'>Start Time</label>
                    <div>
                        <input defaultValue={0} type="number" id="start-time-bar-input" {...register(`instrumentArray.${index}.startTime.bar`)} style={{ width: 40 }} />
                        <span>:</span>
                        <input defaultValue={0} type="number" id="start-time-beat-input" {...register(`instrumentArray.${index}.startTime.beat`)} style={{ width: 40 }} />
                    </div>

                </div>
                <div className={styles.instrumentControlContainer}>
                    <span htmlFor={`number-of-bars-${index}`}>Bars</span>
                    <input defaultValue={4} type="text" id={`number-of-bars-${index}`} style={{ width: 40 }} {...register(`instrumentArray.${index}.maxBars`)} />

                </div>

                <div className={styles.instrumentControlContainer}>
                    <span htmlFor={`number-of-loops-${index}`}>Loops</span>
                    <input defaultValue={4} type="text" id={`number-of-loops-${index}`} style={{ width: 40 }} {...register(`instrumentArray.${index}.numberOfLoops`)} />
                </div>

                <div className={styles.instrumentControlContainer}>
                    <label htmlFor={`probability-${index}`}>Probability</label>

                    <input defaultValue={1} type="number" min={0} max={1} step={0.1} id={`probability-${index}`} style={{ width: 40 }} {...register(`instrumentArray.${index}.probability`)} />
                </div>


                <br />

                {/monoSynth|fmSynth/.test(getValues(`instrumentArray.${index}.instrument`)) &&
                    <InstrumentMods instrument={getValues(`instrumentArray.${index}.slug`)} index={index} />
                }
            </div>

            {/* Instrument Effects */}
            <div className={styles.instrumentEffectsGrid}>
                <Effects index={index} partData={getValues(`instrumentArray.${index}`)} disabled={watch(`instrumentArray.${index}.slug`)} tone={tone} />
            </div>

        </div>
    )
}

export default InstrumentPart;