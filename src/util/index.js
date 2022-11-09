import { Chord, Note, Progression, Scale } from '@tonaljs/tonal';
import { noteLens } from '../config';

export const getRand = (min, max) => Math.floor(Math.random() * (max - min) + min);

export const getProgression = (tonic) => {
    const progs = [["I", "V", "vi", "IV"], ["I", "IV", "V", "I"]];
    const prog = Progression.fromRomanNumerals(tonic, progs[getRand(0, progs.length)]);

    const progArr = [];
    prog.forEach(p => {
        const currentNote = Chord.get(p)
        const cleanNotes = currentNote.notes.map(n => n = Note.simplify(n))
        progArr.push({ notes: cleanNotes, symbol: currentNote.symbol, name: currentNote.name })
    })
    return progArr

}

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

const addOct = (data, oct) => {
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



const generateNoteLen02 = (data, noteLensToUse) => {
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

const generateTimeBars02 = (data, startTime) => {
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

const doTrimNotes = (data, unisonCount) => {
    const trimmed = [];
    data.map(d => {
        if (d.notes.length > 1) {
            d.notes = d.notes.slice(0, unisonCount)
        }
        return trimmed.push(d)
    })

    return trimmed
}

const doMakeBars = (data, amountOfBars) => {
    const bars = [];

    for (let i = 0; i < (data.length - 1); i += 1) {
        if (Number(data[i].tBar.split(':')[0]) < amountOfBars) {
            bars.push(data[i])
        }
    }

    return bars;
}

const doMakeLoops = (data, loopCount, maxBars) => {
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

export const buildLoop = (data, unisonCount, maxBars, loopTimes, noteLensToUse, oct, startTime) => {
    const { partData, scaleData } = processMajor(data, false, 30);
    const withOct = addOct(partData, oct);
    const withNoteLen = generateNoteLen02(withOct, noteLensToUse);
    const withTimeBars = generateTimeBars02(withNoteLen, startTime);
    const trimNotes = doTrimNotes(withTimeBars, unisonCount);
    const makeBars = doMakeBars(trimNotes, maxBars);
    const looped = doMakeLoops(makeBars, loopTimes, maxBars)

    return { scaleData, partData: looped }
}