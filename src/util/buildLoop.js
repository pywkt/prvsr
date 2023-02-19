// import {
//     addOctave,
//     generateNoteLengths,
//     generateTimeBars,
//     makeBars,
//     makeLoops,
//     // processMajor,
//     trimNotes
// } from './partBuilders';

import * as PB from './partBuilders';

// import { processMajor } from './partBuilders/processMajor';

export const buildLoop = (data, unisonCount, maxBars, loopTimes, noteLensToUse, oct, startTime) => {
    const { partData, scaleData } = PB.processMajor(data, false, 30);
    const withOctRes = PB.addOctave(partData, oct);
    const withNoteLenRes = PB.generateNoteLengths(withOctRes, noteLensToUse);
    const withTimeBarsRes = PB.generateTimeBars(withNoteLenRes, startTime);
    const trimNotesRes = PB.trimNotes(withTimeBarsRes, unisonCount);
    const makeBarsRes = PB.makeBars(trimNotesRes, maxBars);
    const loopedRes = PB.makeLoops(makeBarsRes, loopTimes, maxBars)

    return { scaleData, partData: loopedRes }
}