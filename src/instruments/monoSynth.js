import * as Tone from 'tone';
import { globalEffects } from '../components/Effects';
import { globalMods } from '../components/InstrumentMods';

const allSynths = {}

export const monoSynth = (index, remove) => {

    const makeNewSynth = () => allSynths[`monoSynth-${index}`] = {
        monoSynth: new Tone.MonoSynth({
            ...globalMods,
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
        console.log('irsentirst:', globalEffects)
        // monoSynth.filter.frequency.override = false
        if (globalMods?.oscillator) {
             monoSynth.set({oscillator: {...globalMods.oscillator}})
        }
       

        monoSynth.chain(channel, ...globalEffects?.[index] || [], Tone.Destination)
    }

    return allSynths
}