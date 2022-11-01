import * as Tone from 'tone';

export const kit8 = new Tone.Sampler({
    urls: {
        C4: "kick.mp3",
        D4: "snare.mp3",
        E4: "hihat.mp3",
    },
    release: 10,
    baseUrl: "http://localhost:3000/samples/drums/kit8/",
}).toDestination();

export const kit8Parts = ["kick", "snare", "hihat"]