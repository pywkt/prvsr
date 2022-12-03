import * as Tone from 'tone';
import { globalEffects } from '../components/Effects';

const allParts = {}

export const stylophone01 = (index, remove) => {

    const makeNewStylophone01 = () => allParts[`stylophone01-${index}`] = {
        stylophone01: new Tone.Sampler({
            urls: {
                C4: "stylophone01.mp3"
            },
            release: 10,
            baseUrl: "http://localhost:3000/samples/instruments/stylophone01/",
        }), channel: new Tone.Channel({ channelCount: 2 })
    }

    if (!allParts[index]) {
        console.log('*** !allParts[index]')
        allParts[`stylophone01-${index}`] = makeNewStylophone01()
    }

    if (remove) {
        console.log('*** remove && Object.keys !== 0')
        allParts[`stylophone01-${index}`].stylophone01.dispose()
        delete allParts[`stylophone01-${index}`]
    }

    if (allParts[`stylophone01-${index}`]) {
        const { stylophone01, channel } = allParts[`stylophone01-${index}`]
        console.log('stylophone01ToChange:', stylophone01, channel)
        console.log('*** stylophone01 exists. replacing:', allParts)
        stylophone01.name = `stylophone01-${index}`
        channel.name = `channel-${index}`

        console.log('*** making stylophone01 global:', globalEffects[index] || null)
        stylophone01.chain(channel, ...globalEffects?.[index] || [], Tone.Destination)
        // channel.toDestination()
    }

    console.log('allParts:', allParts)

    return allParts
}