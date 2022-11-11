import React, { useState } from 'react';
import { ReactComponent as Play } from '../../icons/play.svg'
import { ReactComponent as Stop } from '../../icons/stop.svg'
import { ReactComponent as Pause } from '../../icons/pause.svg'
import styles from '../../styles/ControlButtons.module.scss'

const ControlButtons = ({ tone, setTime }) => {

    // const [time, setTime] = useState('')
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
        <div>
            <button disabled={isPlaying} className={`${isPlaying && styles.isPlaying} ${styles.trackControlButtons}`} onClick={startTransport}>
                <Play />
            </button>

            <button disabled={!isPlaying} className={`${!isPlaying && styles.isPlaying} ${styles.trackControlButtons}`} onClick={stopTransport}>
                <Stop />
            </button>

            <button disabled={!isPlaying} className={`${!isPlaying && styles.isPlaying} ${styles.trackControlButtons}`} onClick={pauseTransport}>
                <Pause />
            </button>
        </div>
    )
}

export default ControlButtons;