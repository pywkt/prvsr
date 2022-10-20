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

export const processMajor = (data, useProg) => {
    // console.log('processMajor data:', data)
    const { chordScales, tonic } = data
    const randScale = chordScales[getRand(0, chordScales.length)]
    const randScaleData = { ...Scale.get(randScale), chords: Scale.scaleChords(randScale) }

    const chordsToUse = [];
    randScaleData.notes.forEach(note => {
        const currentChord = Chord.getChord(randScaleData.chords[getRand(0, randScaleData.chords.length)], randScaleData.notes[getRand(0, randScaleData.notes.length)])

        currentChord.notes.forEach(cc => {
            if (Note.simplify(cc) !== "") {
                cc = Note.simplify(cc)
            }
        })

        chordsToUse.push({ notes: currentChord.notes, symbol: currentChord.symbol, name: currentChord.name })
    })

    // console.log('chordsToUse:', chordsToUse)

    const progOut = getProgression(tonic)
    // console.log("progOut:", progOut)

    return useProg ? progOut : chordsToUse

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

// const trimDupes = (data) => {
//     console.log('trimDupes:', data)
//     const trimmedDupes = [];

//     data.map((d, i, a) => {
//         const dReg = d.noteLen.match(/(\d+)([a-z])/)
//         // const timeSplit = d.timeBars.split(':')
//         // console.log('timesplit:', timeSplit)
//         console.log('dReg:', dReg)
//         // if (dReg[1])
//     })

//     return trimmedDupes;

// }

const generateTimeBars = (data) => {
    const withTimeBars = [];
    const noteReg = /(\d+)([a-z])/
    let mLen = 0

    data.map((d, i, a) => {
        const noteNumber = d.noteLen.match(/(\d+)([a-z])/)[1]
        console.log(noteNumber)

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
    { name: "1n", value: 1, num: 1, mod: 'n' },
    { name: "2n", value: 0.5, num: 2, mod: 'n' },
    { name: "4n", value: 0.25, num: 4, mod: 'n' },
    { name: "8n", value: 0.08, num: 8, mod: 'n' }
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
    console.log('data:', data)
    const withTimeBars = [];
    let validTimeBar;
    let mTime = 0;
    let qTime = 0;
    let sTime = 0;

    data.map((d, i, a) => {
        const { name, num, value } = d.noteData

        if (i === 0) {
            validTimeBar = "0:0:0"
        } else {
            let previousQn = withTimeBars[i - 1].noteData.num
            let previousTime = withTimeBars[i - 1].timeBar
            let previousQTime = previousTime.split(':')[1]
            let previousMTime = previousTime.split(':')[0]

            if (previousQn === 8) {
                sTime = sTime + 8
            }

            if (previousQn === 4) {
                qTime = qTime + 1
            }

            if (previousQn === 2) {
                qTime = qTime + 2
            }

            if (previousQn === 1) {
                qTime = qTime + 4
            }

            if (sTime > 16) {
                sTime = sTime % 16
                qTime = qTime + 1
            }

            if (qTime > 4) {
                qTime = qTime % 4
                mTime = mTime + 1
            }

            

            // let qTime = Number(previousQTime) + previousQn

            // if (qTime > 4) {
            //     qTime = qTime % 4
            //     mTime = mTime + 1
            // }

            validTimeBar = `${mTime}:${qTime}:${sTime}`
        }

        withTimeBars.push({ ...d, timeBar: validTimeBar })

    })

    return withTimeBars;
}

export const buildLoop = (data) => {
    const chordObj = processMajor(data)
    const withOct = addOct(chordObj)

    const withNoteLen = generateNoteLen02(withOct)
    // console.log('withNoteLen:', withNoteLen)

    const withTimeBars = generateTimeBars02(withNoteLen)
    console.log('withTimeBars:', withTimeBars)

    return withTimeBars



}