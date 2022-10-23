import { Chord, Note, Progression, Scale } from '@tonaljs/tonal';

export const allNotes = ["C", "D", "E", "F", "G", "A", "B", "Cb", "Db", "Eb", "Fb", "Gb", "Ab", "Bb", "C#", "D#", "E#", "F#", "G#", "A#", "B#"]

export const getRand = (min, max) => Math.floor(Math.random() * (max - min) + min);

export const getProgression = (tonic) => {
    // console.log('tonic:', Chord.get(tonic))
    const progs = [["I", "V", "vi", "IV"], ["I", "IV", "V", "I"]];

    const prog = Progression.fromRomanNumerals(tonic, progs[getRand(0, progs.length)]);
    // console.log('prog in func:', prog)

    const progArr = [];
    prog.forEach(p => {
        const currentNote = Chord.get(p)
        const cleanNotes = currentNote.notes.map(n => n = Note.simplify(n))
        // console.log('clean:', cleanNotes)
        progArr.push({ notes: cleanNotes, symbol: currentNote.symbol, name: currentNote.name })
    })
    // console.log('prog02:', progArr)
    return progArr

}

export const processMajor = (data, useProg, amount) => {
    // console.log('processMajor data:', data)
    const maxedAmount = [];
    // console.log('amount:', amount)
    const { chordScales, tonic } = data
    const randScale = chordScales[getRand(0, chordScales.length)]
    const randScaleData = { ...Scale.get(randScale), chords: Scale.scaleChords(randScale) }

    // const withAmount = () => {
    //     const maxedAmount = [];
    //     for (let i = 0; i <= amount; i += 1) {
    //         maxedAmount.push(data[getRand(0, randScaleData.length)])
    //     }

    //     return maxedAmount;
    // }

    // const fff = withAmount()

    // console.log('***:', fff)

    const chordsToUse = [];

    // if (amount) {
    //     for (let i = 0; i <= 20; i += 1) {
    //         chordsToUse.push(chordsToUse[getRand(0, chordsToUse.length)])
    //     }
    // } else {
    randScaleData.notes.forEach(note => {
        const currentChord = Chord.getChord(randScaleData.chords[getRand(0, randScaleData.chords.length)], randScaleData.notes[getRand(0, randScaleData.notes.length)])

        currentChord.notes.forEach(cc => {
            if (Note.simplify(cc) !== "") {
                cc = Note.simplify(cc)
            }
        })

        chordsToUse.push({ notes: currentChord.notes, symbol: currentChord.symbol, name: currentChord.name })
    })
    // }

    // console.log('chordsToUse:', chordsToUse)

    // console.log('chordsToUse:', chordsToUse)

    const progOut = getProgression(tonic)
    // console.log("progOut:", progOut)

    // console.log('ch:', chordsToUse)

    const withAmount = () => {
        for (let i = 0; i <= 20; i += 1) {
            maxedAmount.push(chordsToUse[getRand(0, chordsToUse.length)])
        }
    }

    if (amount) {
        withAmount()
    }

    // console.log('***:', maxedAmount)

    if (useProg) {
        return progOut;
    } else if (amount) {
        return maxedAmount;
    } else {
        return chordsToUse
    }

    // return useProg ? progOut : chordsToUse

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

const makeBars = () => {
    const measure = getRand(0, 4)
    const quarter = getRand(0, 4)
    const sixteenth = getRand(0, 16)
    // return `${measure}:${quarter}:${sixteenth}`
    return `${measure}:${quarter}:0`
}

const makeNoteLen = () => {
    // const noteLens = ["1n", "2n", "4n", "8n"]
    const noteLens = [
        { name: "1n", value: 1 },
        { name: "2n", value: 0.5 },
        { name: "4n", value: 0.25 },
        { name: "8n", value: 0.08 }
    ]
    return noteLens[getRand(0, noteLens.length)]
}

const generateNoteLen = (data) => {
    // console.log('generateTime data:', data)
    const withNoteLen = [];

    data.map(d => {
        withNoteLen.push({
            ...d,
            // timeBars: makeBars(),
            noteLen: makeNoteLen()
        })

    })

    return withNoteLen
}

const generateTimeBars = (data) => {
    const withTimeBars = [];
    const noteReg = /(\d+)([a-z])/
    let mLen = 0

    data.map((d, i, a) => {
        const noteNumber = d.noteLen.match(/(\d+)([a-z])/)[1]
        // console.log(noteNumber)

        let validTimeBar;
        if (i === 0) {
            validTimeBar = "0:0:0"
            console.log('one')
        }
        else {
            let qLen = (withTimeBars[i - 1].noteLen).match(/\d+/)[0]
            let previousBeat = String((withTimeBars[i - 1].timeBar)).split(':')[1]

            qLen = Number(qLen) + Number(previousBeat)

            if ((previousBeat + qLen) > 4) {
                qLen = qLen % 4
                mLen = mLen + 1
            }

            validTimeBar = `${mLen}:${qLen}:0`
        }

        withTimeBars.push({
            ...d,
            timeBar: validTimeBar
        })
    })

    return withTimeBars
}

const noteLens = [
    // { name: "1m", value: 4, num: 1, mod: 'm' },
    { name: "1n", value: 1, num: 1, mod: 'n' },
    { name: "2n", value: 0.5, num: 2, mod: 'n' },
    { name: "4n", value: 0.25, num: 4, mod: 'n' },
    // { name: "8n", value: 0.08, num: 8, mod: 'n' }
]

const generateNoteLen02 = (data) => {
    // console.log('data:', data)
    const withNoteData = [];

    data.map((d, i, a) => {
        withNoteData.push({
            ...d,
            noteData: noteLens[getRand(0, noteLens.length)]
        })
    })

    return withNoteData;

}

const generateTimeBars02 = (data) => {
    console.log('data time:', data)
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

            if (prevName === "4n") {
                qTime = qTime += 1
            }

            if (prevName === "2n") {
                qTime = qTime += 2
            }

            if (prevName === "1n") {
                qTime = qTime += 4
            }

            if (qTime >= 4) {
                mTime = mTime += 1
                qTime = qTime % 4
            }

            validTimeBar = `${mTime}:${qTime}:${sTime}`

            withTimeBars.push({ ...d, tBar: validTimeBar })
        }
    })

    console.log('newTimeBar 0202020:', newTimeBar)
    console.log('withTimeBars:', withTimeBars)

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

const makeLoops = (data, loopTimes) => {
    // console.log('data:', data)
    const finalLoops = [];
    const newLoop = [];

    // Push in data x amount of loopTimes
    for (let i = 1; i < loopTimes; i += 1) {
        data.forEach(d => finalLoops.push(d))
    }

    // console.log('finalLoops:', finalLoops)

    // console.log("data.length:", data.length)
    finalLoops.forEach((f, i) => {
        let measure = Number(f.tBar.split(":")[0])

        // console.log("i:", i)
        if (i <= data.length) {
            newLoop.push(f)
        } else if (i >= data.length - 1) {
            // console.log("measure:", measure, i)
            measure = measure += 4
            f.tBar = `${measure}:0:0`
            newLoop.push(f)
        }
    })

    return newLoop;
}

const doMakeLoops = (data, loopCount, maxBars) => {
    console.log('doMakeLoops data:', data)
    const allLoops = [];
    const newLoops = [];
    const oneBarLoop = [];
    const highestMVal = Number(data[data.length - 1].tBar[0])
    console.log("highest:", highestMVal)
    let barCount = highestMVal;

    for (let i = 1; i <= loopCount; i += 1) {
        allLoops.push(...data)
    }

    console.log('data.length:', data.length)

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

export const buildLoop = (data, unisonCount, maxBars, loopTimes) => {
    const chordObj = processMajor(data, false, 20);
    const withOct = addOct(chordObj);
    const withNoteLen = generateNoteLen02(withOct);
    const withTimeBars = generateTimeBars02(withNoteLen);
    // console.log('withTime:', withTimeBars)

    const trimNotes = doTrimNotes(withTimeBars, unisonCount);
    // console.log("trimNotes:", trimNotes)

    const makeBars = doMakeBars(trimNotes, maxBars);
    console.log('makeBars:', makeBars)

    const looped = doMakeLoops(makeBars, loopTimes, maxBars)
    console.log('looped:', looped)

    return looped
}