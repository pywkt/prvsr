import React, { useState } from 'react';
import { Chord, Note } from '@tonaljs/tonal';
import styles from '../../styles/SelectedPartDetails.module.scss';

const SelectedPartDetails = ({ currentNote, instrumentName }) => {
    const [isVisible, setIsVisible] = useState(false);

    const allNotes = Array.apply(null, { length: 12 })
    const halfNoteIndexes = [1, 3, 6, 8, 10, 13, 15, 18, 20, 22]

    let noteIndex = currentNote?.map(Note.chroma)

    const togglePiano = () => setIsVisible(prev => !prev)

    return (
        <div>
            {isVisible &&
                <>
                    <div className={styles.noteList}>
                        {currentNote && (
                            <>
                                <div>
                                    {currentNote?.map(n => (
                                        <div key={n}>{Note.simplify(n)}</div>
                                    ))}
                                </div>

                                <div className={styles.chordName}>
                                    ({Chord.detect(currentNote)})
                                </div>
                            </>
                        )}
                    </div>

                    <div className={styles.partDetailsText}>{instrumentName}</div>
                    <div className={styles.notesContainer}>

                        {allNotes.map((note, index) => {
                            if (halfNoteIndexes?.includes(index)) {
                                return (
                                    <div
                                        key={`n${index}`}
                                        id={styles[`n${index}`]}
                                        className={`
                                ${styles.allNotes} 
                                ${styles.halfNote} 
                                ${noteIndex?.includes(index) ? styles.filled : ""}`}
                                    />

                                )
                            } else {
                                return (
                                    <div
                                        key={`n${index}`}
                                        id={styles[`n${index}`]}
                                        className={`
                                ${styles.allNotes} 
                                ${styles.wholeNote}
                                ${currentNote?.map(Note.chroma)?.includes(index) ? styles.filled : ""}
                                `}
                                    />
                                )
                            }
                        })}
                    </div>
                </>
            }


            <div className={styles.hidePianoButton}>
                <button type="button" disabled={!currentNote} onClick={togglePiano}>{isVisible ? "Hide Piano" : "Show Piano"}</button>
            </div>

        </div>
    )
}

export default SelectedPartDetails;