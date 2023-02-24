import * as Tone from 'tone';
import { globalEffects } from '../components/Effects';

const allPianos = {}

export const piano01 = (index, remove) => {

  const makeNewPiano = () => allPianos[`piano-${index}`] = {
    piano: new Tone.Sampler({
      urls: {
        A3: "a-3.mp3",
        A4: "a-4.mp3",
        B3: "b3.mp3",
        B4: "b4.mp3",
        C3: "c-3.mp3",
        C4: "c-4.mp3",
        D3: "d-3.mp3",
        D4: "d-4.mp3",
        E3: "e3.mp3",
        E4: "e4.mp3",
        F3: "f-3.mp3",
        F4: "f-4.mp3",
        G3: "g-3.mp3",
        G4: "g-4.mp3",
      },
      release: 10,
      baseUrl: "/samples/",
    }), channel: new Tone.Channel({ channelCount: 2 })
  }

  if (!allPianos[index]) {
    // console.log('*** !allPianos[index]')
    allPianos[`piano-${index}`] = makeNewPiano()
  }

  if (remove) {
    // console.log('*** remove && Object.keys !== 0')
    allPianos[`piano-${index}`].piano.dispose()
    delete allPianos[`piano-${index}`]
  }

  if (allPianos[`piano-${index}`]) {
    const { piano, channel } = allPianos[`piano-${index}`]
    // console.log('pianoToChange:', piano, channel)
    // console.log('*** piano exists. replacing:', allPianos)
    piano.name = `piano-${index}`
    channel.name = `channel-${index}`

    // console.log('*** making piano global:', globalEffects[index] || null)
    piano.chain(channel, ...globalEffects?.[index] || [], Tone.Destination)
    // channel.toDestination()
  }

  // console.log('allPianos:', allPianos)

  return allPianos
}