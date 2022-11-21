import * as Tone from 'tone';
import { kit8Data } from './kit8';
import { sk1Data } from './sk1';
import { globalEffects } from '../../components/Effects';

const allKits = {}

const makeDrumKit = (kitData) => {
    const { name, baseUrl, samples } = kitData
    const newKit = () =>
        allKits[`drums-${name}`] = {
            kit: new Tone.Sampler({
                urls: samples,
                release: 10,
                baseUrl,
            }), channel: new Tone.Channel({ channelCount: 2 })
        }

    allKits[`drums-${name}`] = newKit()
    const { kit, channel } = allKits[`drums-${name}`]
    kit.name = `drums-${name}`
    channel.name = `channel-${name}`
    // kit.connect(channel)
    // channel.toDestination()

    // console.log("drum global:", globalEffects.drums)

    kit.chain(channel, ...globalEffects?.drums || [], Tone.Destination)

    return allKits[`drums-${name}`]

}

export const allDrumKits = [
    { id: 0, name: "Casio SK-1", instrument: makeDrumKit(sk1Data), parts: sk1Data.parts, kit: sk1Data },
    { id: 1, name: "Kit-8", instrument: makeDrumKit(kit8Data), parts: kit8Data.parts, kit: kit8Data}
]

export const makeNewDrums = (current) => {
    console.log("current:", current)
    const kitToMake = allDrumKits.find(k => (k.name === current) || (k.id === Number(current)))
    console.log("kitToMake:", {...kitToMake, instrument: makeDrumKit(sk1Data) })
    return {...kitToMake, instrument: makeDrumKit(kitToMake.kit)}
}