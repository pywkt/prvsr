import { noteLens } from "../../config";
import { getRand } from "../getRand";

/**
 * Generate note len 02
 *
 * @param {Array} data - the data to generate note lengths from
 * @param {Array} noteLensToUse - an array of note lengths to use
 * @return {Array} withNoteData - an array of data with note lengths
 */

export const generateNoteLengths = (data, noteLensToUse) => {
    const withNoteData = [];
    const customNotes = []

    if (noteLensToUse.length > 0) {
        noteLensToUse?.length > 0 && noteLensToUse.map((n, i) => {
            // eslint-disable-next-line
            return noteLens.map(nn => {
                if (nn.name === n) {
                    return customNotes.push(nn)
                }
            })
        })
    }

    data.map((d, i, a) => {
        return withNoteData.push({
            ...d,
            noteData: noteLensToUse.length > 0 ? customNotes[getRand(0, customNotes.length)] : noteLens[getRand(0, noteLens.length)]
        })
    })

    return withNoteData;

}