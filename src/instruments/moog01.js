import * as Tone from 'tone';
import { globalEffects } from '../components/Effects';

const allMoogs01 = {}

export const moog01 = (index, remove) => {

    const makeNewMoog01 = () => allMoogs01[`moog01-${index}`] = {
        moog01: new Tone.Sampler({
            urls: {
                C4: "moog01.mp3"
            },
            release: 10,
            baseUrl: "http://localhost:3000/samples/instruments/moog01/",
        }), channel: new Tone.Channel({ channelCount: 2 })
    }

    if (!allMoogs01[index]) {
        console.log('*** !allMoogs01[index]')
        allMoogs01[`moog01-${index}`] = makeNewMoog01()
    }

    if (remove) {
        console.log('*** remove && Object.keys !== 0')
        allMoogs01[`moog01-${index}`].moog01.dispose()
        delete allMoogs01[`moog01-${index}`]
    }

    if (allMoogs01[`moog01-${index}`]) {
        const { moog01, channel } = allMoogs01[`moog01-${index}`]
        console.log('moog01ToChange:', moog01, channel)
        console.log('*** moog01 exists. replacing:', allMoogs01)
        moog01.name = `moog01-${index}`
        channel.name = `channel-${index}`

        console.log('*** making moog01 global:', globalEffects[index] || null)
        moog01.chain(channel, ...globalEffects?.[index] || [], Tone.Destination)
        // channel.toDestination()
    }

    console.log('allMoogs01:', allMoogs01)

    return allMoogs01
}