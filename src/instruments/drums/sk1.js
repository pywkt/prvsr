// import * as Tone from 'tone';

// const allKits = {}

// export const sk1 = (kitName) => {

//     const makeNewKit = () =>
//         allKits[`drums-${kitName}`] = {
//             kit: new Tone.Sampler({
//                 urls: {
//                     C4: "kick.wav",
//                     D4: "snare.wav",
//                     E4: "hihat.wav",
//                     F4: "ohihat.wav",
//                     G4: "lowtom.wav",
//                     A4: "hitom.wav"
//                 },
//                 release: 10,
//                 baseUrl: "http://localhost:3000/samples/drums/sk1/",
//             }), channel: new Tone.Channel({ channelCount: 2 })
//         }

//     allKits[`drums-${kitName}`] = makeNewKit()
//     const { kit, channel } = allKits[`drums-${kitName}`]
//     kit.name = `drums-${kitName}`
//     channel.name = `channel-${kitName}`
//     kit.connect(channel)
//     channel.toDestination()

//     return allKits[`drums-${kitName}`]
// }

// export const sk1Parts = ["kick", "snare", "hihat", "ohihat", "lowtom", "hitom"]

// export const samples = {
//     C4: "kick.wav",
//     D4: "snare.wav",
//     E4: "hihat.wav",
//     F4: "ohihat.wav",
//     G4: "lowtom.wav",
//     A4: "hitom.wav"
// }

// export const baseUrl = "http://localhost:3000/samples/drums/sk1/"

export const sk1Data = {
    name: 'sk1',
    baseUrl: "http://localhost:3000/samples/drums/sk1/",
    parts: ["kick", "snare", "hihat", "ohihat", "lowtom", "hitom"],
    samples: {
        C4: "kick.wav",
        D4: "snare.wav",
        E4: "hihat.wav",
        F4: "ohihat.wav",
        G4: "lowtom.wav",
        A4: "hitom.wav"
    }
}