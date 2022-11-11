import * as Tone from 'tone';
import { globalEffects } from '../components/Effects';

const allSynths = {}

export const fmSynth = (index, remove) => {

    const makeNewSynth = () => allSynths[`fmSynth-${index}`] = {
        fmSynth: new Tone.FMSynth({
            volume: -20
        }), channel: new Tone.Channel({ channelCount: 2 })
    }

    if (!allSynths[index]) {
        allSynths[`fmSynth-${index}`] = makeNewSynth()
    }

    if (remove) {
        allSynths[`fmSynth-${index}`].synth.dispose()
        delete allSynths[`fmSynth-${index}`]
    }

    if (allSynths[`fmSynth-${index}`]) {
        const { fmSynth, channel } = allSynths[`fmSynth-${index}`]
        fmSynth.name = `fmSynth-${index}`
        channel.name = `channel-${index}`

        fmSynth.chain(channel, ...globalEffects?.[index] || [], Tone.Destination)
    }

    return allSynths
}