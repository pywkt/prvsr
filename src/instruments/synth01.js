import * as Tone from 'tone';

export const synth01 = new Tone.PolySynth(Tone.DuoSynth, { volume: -30 }).toDestination()