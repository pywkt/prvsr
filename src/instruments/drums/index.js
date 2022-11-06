import * as Tone from 'tone';
import { kit8Data } from './kit8';
import { sk1Data } from './sk1';

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
    kit.connect(channel)
    channel.toDestination()

    return allKits[`drums-${name}`]

}

export const allDrumKits = [
    { name: "Casio SK-1", instrument: makeDrumKit(sk1Data), parts: sk1Data.parts },
    { name: "Kit-8", instrument: makeDrumKit(kit8Data), parts: kit8Data.parts }
]