# prvsr
A music thing that makes music.

[Live Demo](https://prvsr.pywkt.com)

#### About:
I originally started this project (for the third time) because I needed a 30 second clip for a video I made with Stable Diffusion, but like all things I make, it became a mild obsession to see how far I could go with it. That being said, prvsr is not meant to be a full-blown DAW. Its main purposes (for me at least) are to:
  1. Generate quick loops
  2. Provide inspiration for writing new songs

All the notes/scales/chords/etc are completely random. Or at least as random as Javascript's `Math.random` will allow.

The two packages that drive this app are:
  1. Tone (web audio processing)
  2. Tonal (music theory)

#### Brief Instructions:
  1. Click the "Add +" button
  2. Select an instrument from the dropdown
  3. Check the boxes of the notes you want to _include_ in the track
  4. Click the "Add to track" button
  5. Press the "Play" button at the top of the screen
  6. Changing some of the settings of an instrument requires you to press the "Add to track" button again, which will overwrite the selected part with a new random melody

#### Tips:
Once a track is playing, click the "Show Piano" button to see the notes. View different tracks on the Piano by clicking the "Select" button next to the track name

"Add to Track" button must be clicked after adding effects to tracks, but once an effect is added it can be turned on/off without updating.

Any changes in the first column of the track's settings will require the track to be updated.

#### Known Bugs:
  * Changing the number of drum steps after creating a drum part will mess up the sequencer
  * Adding an effect after creating a part requires the part to be updated
  * Deleting a part with an empty instrument throws a warning in the console

#### To Do:
  * Change sequencer accordion buttons so they don't span the full width of the page on either side.
  * Write documentation