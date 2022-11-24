# prvsr

A music thing that makes music.

#### About:
I originally started this project (again) because I needed a 30 second clip for a video I made, but like all things I make, it became a mild obsession to see how far I could go with it. That being said, prvsr is not meant to be a full-blown DAW. Its main purposes (for me) are to:
  1. Generate quick, simple loops
  2. Provide inspiration for writing new songs

All the notes/scales/chords/etc are completely random. Or at least as random as Javascript's `Math.random` will allow.

The two packages that drive this app are:
  1. Tone (web audio processing)
  2. Tonal (music theory)

#### Known Bugs:
  * Changing the number of drum steps after creating a drum part will mess up the sequencer
  * Adding an effect after creating a part requires the part to be updated
  * Deleting a part with an empty instrument throws a warning in the console

#### To Do:
  * Change sequencer accordion buttons so they don't span the full width of the page on either side.