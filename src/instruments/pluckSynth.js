import * as Tone from 'tone';
import { globalEffects } from '../components/Effects';
import { globalMods } from '../components/InstrumentMods';

const allSynths = {}

export const pluckSynth = (index, remove) => {

    const makeNewSynth = () => allSynths[`pluckSynth-${index}`] = {
        pluckSynth: new Tone.PluckSynth({
            ...globalMods,
            volume: -20
        }), channel: new Tone.Channel({ channelCount: 2 })
    }

    if (!allSynths[index]) {
        allSynths[`pluckSynth-${index}`] = makeNewSynth()
    }

    if (remove) {
        allSynths[`pluckSynth-${index}`].synth.dispose()
        delete allSynths[`pluckSynth-${index}`]
    }

    if (allSynths[`pluckSynth-${index}`]) {
        const { pluckSynth, channel } = allSynths[`pluckSynth-${index}`]
        pluckSynth.name = `pluckSynth-${index}`
        channel.name = `channel-${index}`

        pluckSynth.chain(channel, ...globalEffects?.[index] || [], Tone.Destination)
    }

    return allSynths
}