import React from 'react';
import { Chord, Note } from '@tonaljs/tonal';
import styles from '../../styles/SelectedPartDetails.module.scss';

const SelectedPartDetails = ({ currentNote }) => {
    if (!currentNote) {
        return null
    }

    // if (currentNote) {
        // console.log('component:', currentNote)
    //     console.log('tonal:', currentNote.map(Note.chroma))
    // }

    // console.log('currentNote:', currentNote)
    // console.log(Note.get(currentNote))

    // const wholeNotes = Array.apply(null, { length: 7 })
    // const halfNotes = Array.apply(null, { length: 5 })

    const allNotes = Array.apply(null, { length: 12 })

    const halfNoteIndexes = [1, 3, 6, 8, 10]

    return (
        <div>
            {currentNote}
            <br />
            {Chord.detect(currentNote)}
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
                                ${currentNote?.map(Note.chroma).includes(index) ? styles.filled : ""}`}
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

                }
                )}


            </div>

        </div>
    )
}

export default SelectedPartDetails;