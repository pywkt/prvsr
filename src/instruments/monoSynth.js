import * as Tone from 'tone';
import { globalEffects } from '../components/Effects';

const allSynths = {}

export const monoSynth = (index, remove) => {

    const makeNewSynth = () => allSynths[`monoSynth-${index}`] = {
        monoSynth: new Tone.MonoSynth({
            volume: -20
        }), channel: new Tone.Channel({ channelCount: 2 })
    }

    if (!allSynths[index]) {
        allSynths[`monoSynth-${index}`] = makeNewSynth()
    }

    if (remove) {
        allSynths[`monoSynth-${index}`].synth.dispose()
        delete allSynths[`monoSynth-${index}`]
    }

    if (allSynths[`monoSynth-${index}`]) {
        const { monoSynth, channel } = allSynths[`monoSynth-${index}`]
        monoSynth.name = `monoSynth-${index}`
        channel.name = `channel-${index}`

        monoSynth.chain(channel, ...globalEffects?.[index] || [], Tone.Destination)
    }

    return allSynths
}