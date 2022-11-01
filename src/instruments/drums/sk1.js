import * as Tone from 'tone';

export const sk1 = new Tone.Sampler({
    urls: {
        C4: "kick.wav",
        D4: "snare.wav",
        E4: "hihat.wav",
        F4: "ohihat.wav",
        G4: "lowtom.wav",
        A4: "hitom.wav"
    },
    release: 10,
    baseUrl: "http://localhost:3000/samples/drums/sk1/",
}).toDestination();

export const sk1Parts = ["kick", "snare", "hihat", "ohihat", "lowtom",  "hitom" ]