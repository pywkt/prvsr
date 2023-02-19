/**
 * Generates a time bar for each note in the data array passed to the function.
 * 
 * @param {array} data - an array of note objects
 * @param {string} startTime - the starting time of the first note
 * 
 * @returns {array} an array of note objects with a time bar attached
 */

export const generateTimeBars = (data, startTime) => {
    const withTimeBars = [];
    let validTimeBar = null;
    let mTime = 0;
    let qTime = 0;
    let sTime = 0;

    data.map((d, i) => {
        if (i === 0) {

            return withTimeBars.push({ ...d, tBar: `0:0:0` })

        } else {
            const prev = data[i - 1]
            const prevName = prev.noteData.name

            if (prevName === "16n") {
                sTime = sTime += 1
            }

            if (prevName === "8n") {
                sTime = sTime += 2
            }

            if (prevName === "8n.") {
                sTime = sTime += 3
            }

            if (prevName === "4n") {
                qTime = qTime += 1
            }

            if (prevName === "4n.") {
                qTime = qTime += 1.5
            }


            if (prevName === "2n") {
                qTime = qTime += 2
            }

            if (prevName === "2n.") {
                qTime = qTime += 3
            }

            if (prevName === "1n") {
                qTime = qTime += 4
            }

            if (sTime >= 4) {
                qTime = qTime += 1
                sTime = sTime % 4
            }

            if (qTime >= 4) {
                mTime = mTime += 1
                qTime = qTime % 4
            }

            validTimeBar = `${mTime}:${qTime}:${sTime}`

            return withTimeBars.push({ ...d, tBar: validTimeBar })
        }
    })

    return withTimeBars;
}