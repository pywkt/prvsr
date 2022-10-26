import { Chord, Note, Progression, Scale } from '@tonaljs/tonal';
import { noteLens } from '../config';

export const allNotes = ["C", "D", "E", "F", "G", "A", "B", "Cb", "Db", "Eb", "Fb", "Gb", "Ab", "Bb", "C#", "D#", "E#", "F#", "G#", "A#", "B#"]

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

    // console.log("randScale:", randScaleData)

    if (useProg) {
        return progOut;
    } else if (amount) {
        return { partData: maxedAmount, scaleData: randScaleData };
    } else {
        return chordsToUse
    }
}

const addOct = (data) => {
    const slimOct = [];

    data.map(d => {
        slimOct.push({
            ...d, notes: d.notes.map(n => {
                if (/\#\#/.test(n)) {
                    return n = Note.simplify(n) + 4
                }

                return n = n + 3
            })
        })
    })

    return slimOct;
}



const generateNoteLen02 = (data, noteLensToUse) => {
    console.log('data:', data)
    console.log("generateNoteLen02:", noteLensToUse)
    const withNoteData = [];
    const customNotes = []

    // const customNoteLens = noteLensToUse.find((n, i) => n === noteLens[i].name)
    if (noteLensToUse.length > 0) {
        noteLensToUse?.length > 0 && noteLensToUse.map((n, i) => {
            noteLens.map(nn => {
                if (nn.name === n) {
                    customNotes.push(nn)
                }
            })
        })
    }

    console.log('customNotes:', customNotes)

    data.map((d, i, a) => {
        withNoteData.push({
            ...d,
            noteData: noteLensToUse.length > 0 ? customNotes[getRand(0, customNotes.length)] : noteLens[getRand(0, noteLens.length)]
        })
    })

    return withNoteData;

}

const generateTimeBars02 = (data) => {
    // console.log('data time:', data)
    const withTimeBars = [];
    const newTimeBar = []
    let validTimeBar = null;
    let mTime = 0;
    let qTime = 0;
    let sTime = 0;

    data.map((d, i) => {
        if (i === 0) {
            withTimeBars.push({ ...d, tBar: "0:0:0" })

        } else {
            // console.log(data[i - 1])
            const prev = data[i - 1]
            const prevName = prev.noteData.name

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

            withTimeBars.push({ ...d, tBar: validTimeBar })
        }
    })

    // console.log('newTimeBar 0202020:', newTimeBar)
    // console.log('withTimeBars:', withTimeBars)

    return withTimeBars;
}

const doTrimNotes = (data, unisonCount) => {
    // console.log('data trim:', data)
    const trimmed = [];
    data.map(d => {
        if (d.notes.length > 1) {
            d.notes = d.notes.slice(0, unisonCount)
        }
        trimmed.push(d)
    })

    return trimmed
}

const doMakeBars = (data, amountOfBars) => {
    // console.log('data01:', data)
    const bars = [];

    data.forEach(d => {
        if (d.tBar.split(':')[0] < amountOfBars) {
            bars.push(d)
        }
    })

    return bars;
}

const doMakeLoops = (data, loopCount, maxBars) => {
    // console.log('doMakeLoops data:', data)
    const allLoops = [];
    const newLoops = [];
    const oneBarLoop = [];
    const highestMVal = Number(data[data.length - 1].tBar[0])
    // console.log("highest:", highestMVal)
    let barCount = highestMVal;

    for (let i = 1; i <= loopCount; i += 1) {
        allLoops.push(...data)
    }

    // console.log('data.length:', data.length)

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
    })

    return maxBars === 1 ? oneBarLoop : newLoops;
}

export const buildLoop = (data, unisonCount, maxBars, loopTimes, noteLensToUse) => {
    // console.log('loop:', data)
    // console.log("selected:", selectedScale)
    console.log('index notesToUse:', noteLensToUse)
    const { partData, scaleData } = processMajor(data, false, 30);
    // console.log('partData:', partData)
    const withOct = addOct(partData);
    const withNoteLen = generateNoteLen02(withOct, noteLensToUse);
    console.log('withNoteLen:', withNoteLen)
    const withTimeBars = generateTimeBars02(withNoteLen);
    // console.log('withTime:', withTimeBars)

    const trimNotes = doTrimNotes(withTimeBars, unisonCount);
    // console.log("trimNotes:", trimNotes)

    const makeBars = doMakeBars(trimNotes, maxBars);
    // console.log('makeBars:', makeBars)

    const looped = doMakeLoops(makeBars, loopTimes, maxBars)
    // console.log('looped:', looped)

    return { scaleData, partData: looped }
}