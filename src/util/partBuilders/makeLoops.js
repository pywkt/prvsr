/**
 * Creates loops of data
 * 
 * @param {Array} data - An array of objects representing the data
 * @param {Number} loopCount - The number of loops to create
 * @param {Number} maxBars - The maximum number of bars in the loop
 * 
 * @return {Array} - An array of objects containing looped data
 */

export const makeLoops = (data, loopCount, maxBars) => {
    const allLoops = [];
    const newLoops = [];
    const oneBarLoop = [];
    const highestMVal = Number(data[data.length - 1].tBar[0])
    let barCount = highestMVal;

    for (let i = 1; i <= loopCount; i += 1) {
        allLoops.push(...data)
    }

    allLoops.map((a, i) => {
        const tBar = a.tBar
        const splitTbar = tBar.split(':')
        const mVal = splitTbar[0]
        const mValNum = Number(mVal)
        const prevMbar = i !== 0 && Number(allLoops[i - 1].tBar.split(":")[0])

        if (maxBars === 1) {
            if (i !== 0 && i % data.length === 0) {
                barCount += 1
            }

            oneBarLoop.push({ ...a, tBar: `${barCount - highestMVal}:${splitTbar[1]}:${splitTbar[2]}` })
        } else
            if (i !== 0 && ((prevMbar !== mValNum))) {
                barCount += 1
            }

        if (i > data.length - 1) {
            newLoops.push({ ...a, tBar: `${barCount - highestMVal}:${splitTbar[1]}:${splitTbar[2]}` })
        } else {
            newLoops.push(a)
        }
        return true
    })

    return maxBars === 1 ? oneBarLoop : newLoops;
}