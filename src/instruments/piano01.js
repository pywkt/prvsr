import * as Tone from 'tone';

export const piano01 = new Tone.Sampler({
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
    baseUrl: "http://localhost:3000/samples/",
  }).toDestination();