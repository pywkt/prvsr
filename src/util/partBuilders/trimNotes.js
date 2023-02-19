/**
 * Trims the note length of the given data array to the unisonCount
 * 
 * @param {Array} data - The array of data objects
 * @param {Number} unisonCount - The length to trim the notes to
 *
 * @returns {Array} trimmed - The array of data objects with trimmed notes
 */

export const trimNotes = (data, unisonCount) => {
    const trimmed = [];
    data.map(d => {
        if (d.notes.length > 1) {
            d.notes = d.notes.slice(0, unisonCount)
        }
        return trimmed.push(d)
    })

    return trimmed
}