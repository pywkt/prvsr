import * as Tone from 'tone';
import { globalEffects } from '../components/Effects';

const allSynths = {}

export const monoSynth = (index, remove) => {

    const makeNewSynth = () => allSynths[`monoSynth-${index}`] = {
        monoSynth: new Tone.MonoSynth({
            oscillator: {
                type: "square"
            },
            envelope: {
                attack: 1.0
            },
            volume: -20
        }), channel: new Tone.Channel({ channelCount: 2 })
    }

    if (!allSynths[index]) {
        // console.log('*** !allSynths[index]')
        allSynths[`monoSynth-${index}`] = makeNewSynth()
    }

    if (remove) {
        // console.log('*** remove && Object.keys !== 0')
        allSynths[`monoSynth-${index}`].synth.dispose()
        delete allSynths[`monoSynth-${index}`]
    }

    if (allSynths[`monoSynth-${index}`]) {
        const { monoSynth, channel } = allSynths[`monoSynth-${index}`]
        // console.log('synthToChange:', synth, channel)
        // console.log('*** synth exists. replacing:', allSynths)
        monoSynth.name = `monoSynth-${index}`
        channel.name = `channel-${index}`

        console.log('*** making monoSynth global:', globalEffects[index] || null)
        monoSynth.chain(channel, ...globalEffects?.[index] || [], Tone.Destination)
        // synth.connect(channel)
        // channel.toDestination()
    }

    // console.log('allSynths:', allSynths)

    return allSynths
}