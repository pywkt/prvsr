import React, { useState, useEffect } from 'react';
import Button from '../Button';
import { ReactComponent as Play } from '../../icons/play.svg'
import { ReactComponent as Stop } from '../../icons/stop.svg'
import { ReactComponent as Pause } from '../../icons/pause.svg'
import styles from '../../styles/Header.module.scss'

const Header = ({ tone }) => {

    const [time, setTime] = useState('')
    const [isPlaying, setIsPlaying] = useState(false);

    const logTime = () => {
        const position = tone.Transport.position.split('.')[0]
        setTime(position)
        return position
    }

    const startTransport = () => {
        tone.start();
        tone.Transport.start()
        setIsPlaying(true)

        tone.Transport.scheduleRepeat((time) => {
            logTime()
        }, "4n")

    }

    const stopTransport = () => {
        tone.Transport.stop()
        setIsPlaying(false)
    }

    const pauseTransport = () => {
        const currentTime = tone.Transport.now()
        tone.Transport.pause(currentTime + 0.4)
        setIsPlaying(false)
    }

    return (
        <div className={styles.headerContainer}>


            <div className={styles.headerDataContainer}>
                <div>
                    {/* <Play /> */}
                    <span className={styles.timeCounter}>{time || "0:0:0"}</span>
                </div>

                <div>
                    <button disabled={isPlaying} className={`${isPlaying && styles.isPlaying} ${styles.trackControlButtons}`} onClick={startTransport}><Play /></button>
                    <button disabled={!isPlaying} className={`${!isPlaying && styles.isPlaying} ${styles.trackControlButtons}`} onClick={stopTransport}><Stop /></button>
                    <button disabled={!isPlaying} className={`${!isPlaying && styles.isPlaying} ${styles.trackControlButtons}`} onClick={pauseTransport}><Pause /></button>
                    {/* <Button onClick={startTransport} label="Start" />
                    <Button onClick={stopTransport} label="Stop" /> */}
                </div>


            </div>

            <div className={styles.headerTitleContainer}>
                <h1>prvsr</h1>
            </div>



        </div>
    )
}

export default Header;