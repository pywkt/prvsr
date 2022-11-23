import React, { useEffect, useState, useRef } from 'react';
import { Note } from '@tonaljs/tonal';
import styles from '../../styles/SelectedPartDetails.module.scss';

const SelectedPartDetails = ({ currentNote }) => {
    if (!currentNote) {
        return null
    }

    if (currentNote) {
        console.log('component:', currentNote)
        console.log('tonal:', currentNote.map(Note.chroma))
    }

    console.log('currentNote:', currentNote)
    console.log(Note.get(currentNote[0]))
    // const wholeNotes = [
    //     'C1', 'C#', 'D1', 'E1', 'F1', 'G1','A1', 'B1', 
    //     'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2', 
    //     'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 
    //     'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4',
    // ]

    const wholeNotes = Array.apply(null, { length: 7 })
    const halfNotes = Array.apply(null, { length: 5 })

    const allNotes = Array.apply(null, { length: 12 })

    const halfNoteIndexes = [1, 3, 6, 8, 10]
    // console.log('whole:', wholeNotes)



    // if (currentNote) {
    //     const filledIndex = currentNote.map(Note.chroma)
    //     const noteToFill = document.getElementById(`n${filledIndex[0]}` || null)

    //     if (noteToFill) {
    //         noteToFill.style.backgroundColor = 'pink'
    //         console.log('noteToFill:', noteToFill)
    //     }

    // }




    return (
        <div>
            {currentNote}

            <div className={styles.notesContainer}>

                {allNotes.map((note, index) => {
                    if (halfNoteIndexes.includes(index)) {
                        return (
                            <div key={`n${index}`} id={styles[`n${index}`]} className={`${styles.allNotes} ${styles.halfNote}`} />

                        )
                    } else {
                        return (
                            <div key={`n${index}`} id={styles[`n${index}`]} className={`${styles.allNotes} ${styles.wholeNote}`} />
                        )
                    }

                }
                )}


            </div>





            {/* <div className={styles.notesContainer}>
                <div className={styles.halfNoteContainer}>
                    <div id='n1' className={styles.halfNote}></div>
                    <div id='n3' className={styles.halfNote}></div>
                    <div id='n6' className={styles.halfNote}></div>
                    <div id='n8' className={styles.halfNote}></div>
                    <div id='n10' className={styles.halfNote}></div>
                </div>

                <div className={styles.wholeNotes}>
                    <div id='n0' className={styles.wholeNote}></div>
                    <div id='n2' className={styles.wholeNote}></div>
                    <div id='n4' className={styles.wholeNote}></div>
                    <div id='n5' className={styles.wholeNote}></div>
                    <div id='n7' className={styles.wholeNote}></div>
                    <div id='n9' className={styles.wholeNote}></div>
                    <div id='n11' className={styles.wholeNote}></div>

                </div>
            </div> */}

            <br />

        </div>
    )
}

export default SelectedPartDetails;