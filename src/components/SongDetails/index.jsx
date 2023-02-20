import React from 'react';
import styles from '../../styles/SongDetails.module.scss';

const SongDetails = ({ scaleData }) => {
    const { name, notes } = scaleData;

    return (
        name && (
            <div className={styles.songDetailsContainer}>
                <ul>
                    <li>
                        <span><strong>{name}</strong></span>
                    </li>
                    <li>
                        <span>{notes.map(note => <span key={note}> {note}</span>)}</span>
                    </li>
                </ul>

            </div>
        )
    )
}

export default SongDetails;