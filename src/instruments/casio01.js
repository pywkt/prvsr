import * as Tone from 'tone';
import { globalEffects } from '../components/Effects';

const allParts = {}

export const casio01 = (index, remove) => {

    const makeNewCasio01 = () => allParts[`casio01-${index}`] = {
        casio01: new Tone.Sampler({
            urls: {
                C4: "casio01.mp3"
            },
            release: 10,
            baseUrl: "/samples/instruments/casio01/",
        }), channel: new Tone.Channel({ channelCount: 2 })
    }

    if (!allParts[index]) {
        console.log('*** !allParts[index]')
        allParts[`casio01-${index}`] = makeNewCasio01()
    }

    if (remove) {
        console.log('*** remove && Object.keys !== 0')
        allParts[`casio01-${index}`].casio01.dispose()
        delete allParts[`casio01-${index}`]
    }

    if (allParts[`casio01-${index}`]) {
        const { casio01, channel } = allParts[`casio01-${index}`]
        console.log('casio01ToChange:', casio01, channel)
        console.log('*** casio01 exists. replacing:', allParts)
        casio01.name = `casio01-${index}`
        channel.name = `channel-${index}`

        console.log('*** making casio01 global:', globalEffects[index] || null)
        casio01.chain(channel, ...globalEffects?.[index] || [], Tone.Destination)
        // channel.toDestination()
    }

    console.log('allParts:', allParts)

    return allParts
}