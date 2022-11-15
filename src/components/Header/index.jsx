import React, { useState } from 'react';
import ControlButtons from '../ControlButtons';
import styles from '../../styles/Header.module.scss'

const Header = ({ tone }) => {
    const [time, setTime] = useState('')

    const updateBpm = (e) => {
        tone.Transport.bpm.value = e.target.value
    }

    const updateSwing = (e) => {
        tone.Transport.swing = e.target.value
    }

    return (
        <div className={styles.headerContainer}>
            <div className={styles.headerDataContainer}>
                <span className={styles.timeCounter}>
                    {time || "0:0:0"}
                </span>



                <ControlButtons tone={tone} setTime={setTime} />

                <div className={styles.tempoAndSwingContainer}>
                    <label htmlFor='song-bpm'>BPM: </label>
                    <input type='number' defaultValue={120} id='song-bpm' onChange={updateBpm} />

                    <label htmlFor='song-swing'>Swing: </label>
                    <input type='number' min={0} max={1} step={0.1} defaultValue={0} onChange={updateSwing} id='song-swing' />
                </div>

            </div>

            <div className={styles.headerTitleContainer}>
                <h1>prvsr</h1>
            </div>
        </div>
    )
}

export default Header;