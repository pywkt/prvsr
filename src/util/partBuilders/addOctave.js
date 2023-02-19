import { Note } from '@tonaljs/tonal';

/**
 * Adds an octave to the notes of a given data array.
 * 
 * @param {array} data - An array of objects containing note values.
 * @param {string} oct - The desired octave to add.
 * @returns {array} slimOct - An array of objects with the notes modified with the desired octave.
 */

export const addOctave = (data, oct) => {
    const slimOct = [];

    data.map(d => {
        return slimOct.push({
            ...d, notes: d.notes.map(n => {
                if (/##/.test(n)) {
                    return n = Note.simplify(n) + oct || 4
                }

                return n = n + oct || 3
            })
        })
    })

    return slimOct;
}