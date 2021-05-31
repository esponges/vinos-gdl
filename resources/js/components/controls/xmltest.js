// const xmlFileUrl = "http://127.0.0.1:8000/Arkansas-Traveller.musicxml";
const xmlFileUrl = "http://127.0.0.1:8000/Angeline-the-Baker.musicxml";
// const xmlFileUrl = "http://127.0.0.1:8000/Black-Mountain-Rag.musicxml";
// const xmlFileUrl = "http://127.0.0.1:8000/Billy-in-the-Lowground.musicxml";
// const xmlFileUrl = "http://127.0.0.1:8000/Wayfaring_Stranger-upload-uncompressed-musicxml-1bar-count-in-120BPM.musicxml";
// const xmlFileUrl = "http://127.0.0.1:8000/Blue-Moon-of-Kentucky.musicxml";
// const xmlFileUrl = "http://127.0.0.1:8000/Wildwood-Flower-Crosspicking-without-tab-stems.musicxml";

import { parseString } from "xml2js";

const song = [];
let m = 0;
let timeCounter = 0;
const bpm = 120;

// Dot value extends the note duration by half
// e.g. if it's quarter is duration will be
// quarter + eighth (5/16)
const setDotValue = (note) => {
    switch (note.type) {
        case "half":
            return "quarter";
        case "quarter":
            return "eighth";
        case "eighth":
            return "16th";
        default:
    }
};

const setChordTime = (sng) => {
    for (let i = 0; i < sng.length; i++) {
        if (sng[i].isChord && i > 0) {
            if (sng[i].defaultXPos === sng[i - 1].defaultXPos) {
                sng[i].time = sng[i - 1].time;
            }
        }
    }
    return sng;
};

const mutateSongForPlayer = (finalSong) => {
    let mutatedSong = [];
    for (let i = 0; i < finalSong.length; i++) {
        finalSong[i].id = i;
        if (finalSong[i]?.chordIdx === "last") {
            mutatedSong[i] = [finalSong[i]];
            for (let j = 1; j < 4; j++) {
                // Check last 3 notes in case they are same chord
                if (
                    finalSong[i - j]?.isChord &&
                    finalSong[i - j]?.defaultXPos === finalSong[i].defaultXPos
                ) {
                    mutatedSong[i].unshift(finalSong[i - j]);
                }
            }
        }
        if (!finalSong[i]?.chordIdx) {
            mutatedSong[i] = [finalSong[i]];
        }
    }
    // remove empty indexes
    mutatedSong = mutatedSong.filter((note) => note);

    return mutatedSong;
};

export const incrementTimer = (noteDuration, dot = false, btpm = 120) => {
    const msPerBeat = 60 / btpm;

    // for a 4/4 song
    const noteLength = {
        complete: msPerBeat * 4,
        whole: msPerBeat * 4,
        half: msPerBeat * 2,
        quarter: msPerBeat * 1,
        eighth: msPerBeat * 0.5,
        "16th": msPerBeat * 0.25,
        "32th": msPerBeat * 0.125,
    };

    switch (noteDuration) {
        case "complete":
            return (timeCounter += !dot
                ? noteLength.complete
                : noteLength.complete * 1.5);
        case "whole":
            return (timeCounter += !dot
                ? noteLength.whole
                : noteLength.whole * 1.5);
        case "half":
            return (timeCounter += !dot
                ? noteLength.half
                : noteLength.half * 1.5);
        case "quarter":
            return (timeCounter += !dot
                ? noteLength.quarter
                : noteLength.quarter * 1.5);
        case "eighth":
            return (timeCounter += !dot
                ? noteLength.eighth
                : noteLength.eighth * 1.5);
        case "16th":
            return (timeCounter += !dot
                ? noteLength["16th"]
                : noteLength["16th"] * 1.5);
        case "32th":
            return (timeCounter += !dot
                ? noteLength["32th"]
                : noteLength.complete * 1.5);
        default:
            break;
    }
};

const getLastNoteLength = () => {
    const onlyNotesAndRests = getOnlyNotesAndRests();
    const lastNoteLength =
        onlyNotesAndRests[onlyNotesAndRests.length - 1].duration;
    return lastNoteLength;
};

const getOnlyNotesAndRests = () => song.filter((el) => el.isRest || el.name);

const timerAction = (counter, hasDot, btpm) => {
    if (counter === 1) return 0;

    const partialSong = getOnlyNotesAndRests();
    if (
        counter > 1 &&
        partialSong[partialSong.length - 2]?.addToTimer !== undefined
    ) {
        return timeCounter;
    }

    const incrementNormally = incrementTimer(getLastNoteLength(), hasDot, btpm);
    return incrementNormally;
};

const pushSymbol = (count) => {
    for (let i = 0; i < count; i++) {
        song.push({
            isLine: false,
            color: "white",
            show: false,
            duration: 0,
            time: 0,
            offset: 0,
            isSymbol: true,
        });
    }
};

const pushLine = (count, idx) => {
    // starting measure line
    for (let i = 0; i < count; i++) {
        song.push({
            isLine: true,
            color: "white",
            duration: 0,
            time: 0,
            offset: 0,
            show: false,
            measure: idx + 1,
        });
    }
};

let repeaterCounter = 0;

const pushRepeater = (measure, idx, backward = false) => {
    repeaterCounter += 1;
    song.push({
        repeater: true,
        repeaterCount: repeaterCounter,
        direction: !backward
            ? measure.barline.repeat.$.direction
            : measure.barline[1].repeat.$.direction,
        color: "white",
        duration: 0,
        time: 0,
        offset: 0,
        show: false,
        measure: idx + 1,
    });
};

// pushRest(actualNoteHasDot, restLength, m, bpm, nt, idx);
const pushRest = (hasDot, restLn, count, btpm, nt, idx) => {
    song.push({
        color: "white",
        show: false,
        isRest: true,
        dot: hasDot,
        duration: restLn,
        measure: idx + 1,
        staff: nt?.staff ?? false,
        time: timerAction(count, hasDot, btpm),
    });
};

export const fetchXML = (xmlFileUrl) =>
    new Promise((resolve, reject) => {
        const fetchUrlAsync = async () => {
            const result = await fetch(xmlFileUrl);
            if (!result.ok) {
                console.error("Error fetching file");
                return;
            }

            const xml = await result.text();
            return xml;
        };

        fetchUrlAsync().then((xmlRes) => {
            parseString(xmlRes, { explicitArray: false }, (error, res) => {
                // console.dir(res);
                const parsedSong = res;
                pushSymbol(2); // add symbols (clef and 4/4)

                parsedSong["score-partwise"]?.part[1]?.measure.map(
                    (ms, idx) => {
                        pushLine(1, idx);

                        // set repeater if any
                        if (ms?.barline?.repeat) {
                            pushRepeater(ms, idx);
                        }

                        // loop through notes from the measure
                        ms.note.map(async (nt, i) => {
                            const songWithOnlyNotes = getOnlyNotesAndRests();
                            const lastNote =
                                songWithOnlyNotes[songWithOnlyNotes.length - 1];
                            const lastNoteHasDot = !!lastNote?.dot;
                            const actualNoteHasDot =
                                nt?.dot === "" ? setDotValue(nt) : false;

                            // check if note is rest -silence- note
                            if (nt?.rest === "" || nt?.rest) {
                                // only if rest is staff == 1 add
                                // otherwise there's repetition of the note
                                if (nt.staff === "1") {
                                    m += 1;
                                    const restLength = nt?.type ?? "complete";
                                    pushRest(
                                        actualNoteHasDot,
                                        restLength,
                                        m,
                                        bpm,
                                        nt,
                                        idx
                                    );
                                }
                            }

                            // check if it's tab note
                            if (nt?.notations?.technical?.fret !== undefined) {
                                m += 1;
                                const noteLength = nt?.type;
                                let isChord = false;
                                if (m > 1) {
                                    // avoid breaking if it's first note
                                    isChord =
                                        nt?.$["default-x"] ===
                                        lastNote.defaultXPos;
                                }
                                song.push({
                                    defaultXPos: nt?.$["default-x"],
                                    isChord,
                                    chordIdx: isChord ? "last" : false,
                                    tie: nt?.tie ?? false,
                                    pitch: `${nt?.pitch?.step}${nt?.pitch?.octave}`,
                                    dot: actualNoteHasDot,
                                    measure: idx + 1,
                                    color: "white",
                                    show: false,
                                    name: {
                                        position: parseInt(
                                            nt?.notations?.technical?.fret
                                        ),
                                        string: parseInt(
                                            nt?.notations?.technical?.string
                                        ),
                                    },
                                    offset: 0,
                                    time: timerAction(m, lastNoteHasDot, bpm),
                                    duration: noteLength,
                                });
                                if (
                                    nt?.$["default-x"] ===
                                        lastNote?.defaultXPos &&
                                    m > 1
                                ) {
                                    lastNote.isChord = true;
                                    lastNote.addToTimer = false;
                                    lastNote.chordIdx = "not-last";
                                }
                            }
                        });

                        // set the end of the repeater, if any
                        let backwardRepeaterIdx = [];

                        if (
                            ms?.barline &&
                            ms?.barline.length > 1 &&
                            ms?.barline[1].repeat
                        ) {
                            pushRepeater(ms, idx, true);
                        }
                    }
                );

                const finalSong = setChordTime(song);
                const mutatedSong = mutateSongForPlayer(finalSong);
                console.log('mutatedSong!!', mutatedSong);

                resolve(mutatedSong);
                reject();
            });
        });
    });

const mandolin = {
    G4: { position: 0, string: 4 },
    "G#4": { position: 1, string: 4 },
    A4: { position: 2, string: 4 },
    "A#4": { position: 3, string: 4 },
    B4: { position: 4, string: 4 },
    C5: { position: 5, string: 4 },
    "C#5": { position: 6, string: 4 },

    D5: { position: 0, string: 3 },
    "D#5": { position: 1, string: 3 },
    E5: { position: 2, string: 3 },
    F5: { position: 3, string: 3 },
    "F#5": { position: 4, string: 3 },
    G5: { position: 5, string: 3 },
    "G#5": { position: 6, string: 3 },

    A5: { position: 0, string: 2 },
    "A#5": { position: 1, string: 2 },
    B5: { position: 2, string: 2 },
    C6: { position: 3, string: 2 },
    "C#6": { position: 4, string: 2 },
    D6: { position: 5, string: 2 },
    "D#6": { position: 6, string: 2 },

    E6: { position: 0, string: 1 },
    F6: { position: 1, string: 1 },
    "F#6": { position: 2, string: 1 },
    G6: { position: 3, string: 1 },
    "G#6": { position: 4, string: 1 },
    A6: { position: 5, string: 1 },
    "A#6": { position: 6, string: 1 },

    notFound: { position: "?", string: 1 },
};

// const mandolin = { // for sally goodin, and soldiers joy slow version, wayfaring stranger
//   'G3': { position: 0, string: 4 },
//   'G#3': { position: 1, string: 4 },
//   'A3': { position: 2, string: 4 },
//   'A#3': { position: 3, string: 4 },
//   'B3': { position: 4, string: 4 },
//   'C4': { position: 5, string: 4 },
//   'C#4': { position: 6, string: 4 },

//   'D4': { position: 0, string: 3 },
//   'D#4': { position: 1, string: 3 },
//   'E4': { position: 2, string: 3 },
//   'F4': { position: 3, string: 3 },
//   'F#4': { position: 4, string: 3 },
//   'G4': { position: 5, string: 3 },
//   'G#4': { position: 6, string: 3 },

//   'A4': { position: 0, string: 2 },
//   'A#4': { position: 1, string: 2 },
//   'B4': { position: 2, string: 2 },
//   'C5': { position: 3, string: 2 },
//   'C#5': { position: 4, string: 2 },
//   'D5': { position: 5, string: 2 },
//   'D#5': { position: 6, string: 2 },

//   'E5': { position: 0, string: 1 },
//   'F5': { position: 1, string: 1 },
//   'F#5': { position: 2, string: 1 },
//   'G5': { position: 3, string: 1 },
//   'G#5': { position: 4, string: 1 },
//   'A5': { position: 5, string: 1 },
//   'A#5': { position: 6, string: 1 },

//   'notFound': { position: '?', string: 1 },
// };
