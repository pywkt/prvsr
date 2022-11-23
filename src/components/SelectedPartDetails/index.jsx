import React from 'react';
import { Chord, Note } from '@tonaljs/tonal';
import styles from '../../styles/SelectedPartDetails.module.scss';

const SelectedPartDetails = ({ currentNote }) => {
    if (!currentNote) {
        return null
    }

    const allNotes = Array.apply(null, { length: 12 })
    const halfNoteIndexes = [1, 3, 6, 8, 10, 13, 15, 18, 20, 22]

    let noteIndex = currentNote?.map(Note.chroma)


    return (
        <div>
            <div className={styles.noteList}>
                <div>
                    {currentNote.map(n => (
                        <div>{Note.simplify(n)}</div>
                    ))}
                </div>


                <div className={styles.chordName}>
                    ({Chord.detect(currentNote)})
                </div>
            </div>

            <br />

            <div className={styles.notesContainer}>

                {allNotes.map((note, index) => {
                    if (halfNoteIndexes.includes(index)) {
                        return (
                            <div
                                key={`n${index}`}
                                id={styles[`n${index}`]}
                                className={`
                                ${styles.allNotes} 
                                ${styles.halfNote} 
                                ${noteIndex.includes(index) ? styles.filled : ""}`}
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
                                ${currentNote?.map(Note.chroma).includes(index) ? styles.filled : ""}
                                `}
                            />
                        )
                    }
                })}
            </div>
        </div>
    )
}

export default SelectedPartDetails;