import React from 'react';
import { Chord, Note } from '@tonaljs/tonal';
import styles from '../../styles/SelectedPartDetails.module.scss';

const SelectedPartDetails = ({ currentNote }) => {
    if (!currentNote) {
        return null
    }

    if (currentNote) {
        console.log('component:', currentNote)
        console.log('tonal:', currentNote.map(Note.chroma))
    }

    // console.log('currentNote:', currentNote)
    // console.log(Note.get(currentNote))

    // const wholeNotes = Array.apply(null, { length: 7 })
    // const halfNotes = Array.apply(null, { length: 5 })

    const allNotes = Array.apply(null, { length: 12 })

    const halfNoteIndexes = [1, 3, 6, 8, 10, 13, 15, 18, 20, 22]

    let noteIndex = currentNote?.map(Note.chroma)
    // const currentOctave = [...currentNote?.map(n => n.substr(-1))]
    // console.log("oct:", currentOctave)
    
    // if (currentOctave[0] === '4') {
    //     const fff = noteIndex.map(n => n = n + 12)
    //     console.log("fff:", fff)
    //     noteIndex = fff
    // }

    // console.log("note:", noteIndex)

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

                }
                )}


            </div>

        </div>
    )
}

export default SelectedPartDetails;