import { Chord, Note, Progression } from '@tonaljs/tonal';
import { getRand } from '../getRand';

export const getProgression = (tonic) => {
    const progs = [["I", "V", "vi", "IV"], ["I", "IV", "V", "I"]];
    const prog = Progression.fromRomanNumerals(tonic, progs[getRand(0, progs.length)]);

    const progArr = [];
    prog.forEach(p => {
        const currentNote = Chord.get(p)
        const cleanNotes = currentNote.notes.map(n => n = Note.simplify(n))
        progArr.push({ notes: cleanNotes, symbol: currentNote.symbol, name: currentNote.name })
    })
    return progArr

}