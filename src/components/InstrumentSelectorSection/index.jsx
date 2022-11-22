import React from 'react';
import Button from '../Button';
import VolumeControl from '../ChannelControls/VolumeControl';
import MuteButton from '../ChannelControls/MuteButton';
import SoloButton from '../ChannelControls/SoloButton';
import UnisonCount from '../UnisonCount';
import Octave from '../Octave';
import StartTime from '../StartTime';
import NumberOfBars from '../NumberOfBars';
import NumberOfLoops from '../NumberOfLoops';
import ProbabilityAmount from '../ProbabilityAmount';
import NotesToUse from '../NotesToUse';
import { ReactComponent as Trash } from '../../icons/trash.svg';
import styles from '../../styles/App.module.scss';

const InstrumentSelectorSection = ({ instruments, register, index, data, commitInstrument, deletePart}) => {

    return (
        <>
            <select {...register(`instrumentArray.${index}.instrument`)}>
                {instruments.map((i, ind) => (
                    <option value={i.slug} key={i.name}>
                        {i.name}
                    </option>
                ))}
            </select>

            <div className={styles.channelControls}>
                <VolumeControl index={index} data={data} />
                <SoloButton index={index} data={data} />
                <MuteButton index={index} data={data} />
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

        </>
    )
}

export default InstrumentSelectorSection;