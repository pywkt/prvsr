import * as Tone from 'tone';
import { globalEffects } from '../components/Effects';
import { globalMods } from '../components/InstrumentMods';

const allSynths = {}

export const amSynth = (index, remove) => {

    const makeNewSynth = () => allSynths[`amSynth-${index}`] = {
        amSynth: new Tone.AMSynth({
            ...globalMods,
            volume: -20
        }), channel: new Tone.Channel({ channelCount: 2 })
    }

    if (!allSynths[index]) {
        allSynths[`amSynth-${index}`] = makeNewSynth()
    }

    if (remove) {
        allSynths[`amSynth-${index}`].synth.dispose()
        delete allSynths[`amSynth-${index}`]
    }

    if (allSynths[`amSynth-${index}`]) {
        const { amSynth, channel } = allSynths[`amSynth-${index}`]
        amSynth.name = `amSynth-${index}`
        channel.name = `channel-${index}`

        amSynth.chain(channel, ...globalEffects?.[index] || [], Tone.Destination)
    }

    return allSynths
}