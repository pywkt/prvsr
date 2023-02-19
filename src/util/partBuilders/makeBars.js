/**
 * @function makeBars
 * @description Returns an array of data elements that are less than the amount of bars passed in
 * @param {array} data - An array of data elements
 * @param {number} amountOfBars - The maximum value of bars to match
 * @returns {array} bars - An array of data elements that are less than the amount of bars passed in
 */

export const makeBars = (data, amountOfBars) => {
    const bars = [];

    for (let i = 0; i < (data.length - 1); i += 1) {
        if (Number(data[i].tBar.split(':')[0]) < amountOfBars) {
            bars.push(data[i])
        }
    }

    return bars;
}