import * as Tone from 'tone';

const allSynths = {}

export const synth01 = (index, remove) => {

    const makeNewSynth = () => allSynths[`synth-${index}`] = { synth: new Tone.PolySynth(Tone.DuoSynth, { volume: -30 }), channel: new Tone.Channel({ channelCount: 2 }) }

    if (!allSynths[index]) {
        console.log('*** !allSynths[index]')
        allSynths[`synth-${index}`] = makeNewSynth()
    }

    if (remove) {
        console.log('*** remove && Object.keys !== 0')
        allSynths[`synth-${index}`].synth.dispose()
        delete allSynths[`synth-${index}`]
    }

    if (allSynths[`synth-${index}`]) {
        const { synth, channel } = allSynths[`synth-${index}`]
        console.log('synthToChange:', synth, channel)
        console.log('*** synth exists. replacing:', allSynths)
        synth.name = `synth-${index}`
        channel.name = `channel-${index}`
        synth.connect(channel)
        channel.toDestination()
    }

    console.log('allSynths:', allSynths)

    return allSynths
}