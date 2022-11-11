import React, { useState } from 'react';
import ControlButtons from '../ControlButtons';
import styles from '../../styles/Header.module.scss'

const Header = ({ tone }) => {
    const [time, setTime] = useState('')

    return (
        <div className={styles.headerContainer}>
            <div className={styles.headerDataContainer}>
                <span className={styles.timeCounter}>
                    {time || "0:0:0"}
                </span>

                <ControlButtons tone={tone} setTime={setTime} />
            </div>

            <div className={styles.headerTitleContainer}>
                <h1>prvsr</h1>
            </div>
        </div>
    )
}

export default Header;