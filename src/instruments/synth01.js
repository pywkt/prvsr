import * as Tone from 'tone';

const allSynths = []

export const synth01 = (index, remove) => {

    const makeNewSynth = () => ({ synth: new Tone.PolySynth(Tone.DuoSynth, { volume: -30 }), channel: new Tone.Channel({ channelCount: 2 }) })

    if (!allSynths[index]) {
        console.log('*** !allSynths[index]')
        allSynths.push(makeNewSynth())
        // allSynths.push({ synth: new Tone.PolySynth(Tone.DuoSynth, { volume: -30 }), channel: new Tone.Channel({ channelCount: 2 }) })
        // allSynths[index].name = `synth-${index}`
    }

    if (remove) {
        console.log('*** remove && Object.keys !== 0')
        allSynths[index].synth.dispose()
        const indexToRemove = allSynths.findIndex(f => f.name === `synth-${index}`)
        console.log('indexToRemove:', indexToRemove)
        allSynths.splice(indexToRemove, 1)
    }

    if (allSynths[index]) {
        const { synth, channel } = allSynths[index]
        console.log('*** synth exists. replacing:', allSynths)
        allSynths.splice(index, makeNewSynth())
        synth.name = `synth-${index}`
        channel.name = `channel-${index}`
        synth.connect(channel)
        channel.toDestination()
        // allSynths[index].channel.send(allSynths[index].synth)
    }




    console.log('allSynths:', allSynths)

    return allSynths
}