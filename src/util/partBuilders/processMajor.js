import { Chord, Note, Scale } from '@tonaljs/tonal';
import { getProgression } from './getProgression';
import { getRand } from '../getRand';

/**
 * Generates a major scale progression and/or a specified amount of chords from the generated progression
 * 
 * @param {Object} data - Data object containing chordScales and tonic
 * @param {boolean} useProg - Flag to indicate whether to return progression or not
 * @param {number} amount - The number of chords to be returned
 * 
 * @returns {Object} Returns progression or a specified amount of chords from the generated progression.
 */

// export const getRand = (min, max) => Math.floor(Math.random() * (max - min) + min);

let prevScale;

export const processMajor = (data, useProg, amount) => {
    const maxedAmount = [];
    const chordsToUse = [];
    const { chordScales, tonic } = data

    // Get a random scale from the random chord
    const randScale = !prevScale ? chordScales[getRand(0, chordScales.length)] : prevScale
    prevScale = randScale

    // Get the data for the scale
    const randScaleData = { ...Scale.get(randScale), chords: Scale.scaleChords(randScale) }
    // console.log("randScaleData:", randScaleData)

    // Get a random chord for every note in the scale
    randScaleData.notes.forEach(note => {
        const currentChord = Chord.getChord(randScaleData.chords[getRand(0, randScaleData.chords.length)], randScaleData.notes[getRand(0, randScaleData.notes.length)])

        currentChord.notes.forEach(cc => {
            if (Note.simplify(cc) !== "") {
                cc = Note.simplify(cc)
            }
        })

        chordsToUse.push({ notes: currentChord.notes, symbol: currentChord.symbol, name: currentChord.name })
    })

    // Needs work. ToDo: Pick a random progression from the list and generate the chords and put them in order
    const progOut = getProgression(tonic)

    // Pick n amount of notes from the chords that were generated above
    const withAmount = () => {
        for (let i = 0; i <= amount; i += 1) {
            maxedAmount.push(chordsToUse[getRand(0, chordsToUse.length)])
        }
    }

    if (amount) {
        withAmount()
    }

    if (useProg) {
        return progOut;
    } else if (amount) {
        return { partData: maxedAmount, scaleData: randScaleData };
    } else {
        return chordsToUse
    }
}