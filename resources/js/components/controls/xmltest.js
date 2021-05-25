const xmlFileUrl = "http://127.0.0.1:8000/Arkansas-Traveller.musicxml";
// const xmlFileUrl = "http://127.0.0.1:8000/Black-Mountain-Rag.musicxml";
// const xmlFileUrl = "http://127.0.0.1:8000/Billy-in-the-Lowground.musicxml";
// const xmlFileUrl =
//     "http://127.0.0.1:8000/Wayfaring_Stranger-upload-uncompressed-musicxml-1bar-count-in-120BPM.musicxml";
// const xmlFileUrl = "http://127.0.0.1:8000/Blue-Moon-of-Kentucky.musicxml";
import { parseString } from "xml2js";

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
    }
};

let song = [];
let m = 0;
let timeCounter = 0;
const bpm = 120;

const incrementTimer = (noteDuration, dot = false, bpm) => {
    const msPerBeat = 60 / bpm;
    console.log("last note duration is", noteDuration, 'dot true?', dot);

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
            console.log(
                "half and we are adding",
                !dot ? noteLength.half : noteLength.half * 1.5
            );
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

const getOnlyNotesAndRests = () => song.filter((el) => el.isRest || el.fret);

const timerAction = (m, hasDot, bpm) => {
    if (m === 1) return 0;

    const partialSong = getOnlyNotesAndRests();
    if (
        m > 1 &&
        partialSong[partialSong.length - 2]?.addToTimer !== undefined
    ) {
        return timeCounter;
    }

    const incrementNormally = incrementTimer(getLastNoteLength(), hasDot, bpm);
    return incrementNormally;
};

export const fetchXML = async () => {
    const parseXML = async () => {
        const result = await fetch(xmlFileUrl);
        if (!result.ok) {
            console.error("Error fetching file");
            return;
        }

        const xml = await result.text();
        parseString(xml, { explicitArray: false }, (error, result) => {
            console.dir(result);

            const parsedSong = result;

            // getSongFirstNote(parsedSong);

            parsedSong["score-partwise"]?.part[1]?.measure.map((ms, idx) => {
                // starting measure line
                song.push({
                    isLine: true,
                    location: "start",
                    show: false,
                    time: 0,
                    duration: 0,
                });

                // set repeater if any
                if (ms?.barline?.repeat !== undefined) {
                    song.push({
                        repeater: true,
                        direction: ms.barline.repeat.$.direction,
                        measure: idx + 1,
                    });
                }
                // loop through notes from the measure
                ms.note.map(async(nt) => {

                    const songWithOnlyNotes = getOnlyNotesAndRests();
                    let lastNote = songWithOnlyNotes[songWithOnlyNotes.length - 1];
                    const lastNoteHasDot = lastNote?.dot ? true : false;
                    const actualNoteHasDot =
                        nt?.dot === "" ? setDotValue(nt) : false;

                    // check if note is rest -silence- note
                    if (nt?.rest === "" || nt?.rest) {
                        // only if rest is staff == 1 add
                        // otherwise there's repetition of the note
                        if (nt.staff == 1) {
                            m += 1;
                            const restLength = nt?.type ?? "complete";
                            song.push({
                                isRest: true,
                                dot: actualNoteHasDot,
                                duration: restLength,
                                measure: idx + 1,
                                staff: nt?.staff ?? false,
                                time: timerAction(m, lastNoteHasDot, bpm),
                            });
                        }
                    }

                    // check if it's tab note
                    if (nt?.notations?.technical?.fret !== undefined) {
                        m += 1;
                        const noteLength = nt?.type;
                        const isChord = nt?.$["default-x"] === lastNote.defaultXPos
                                    ? true
                                    : false;
                        song.push({
                            defaultXPos: nt?.$["default-x"],
                            isChord: isChord,
                            tie: nt?.tie ?? false,
                            pitch: `${nt?.pitch?.step}${nt?.pitch?.octave}`,
                            dot: actualNoteHasDot,
                            fret: nt?.notations?.technical?.fret,
                            string: nt?.notations?.technical?.string,
                            duration: noteLength,
                            measure: idx + 1,
                            time: timerAction(m, lastNoteHasDot, bpm),
                        });
                        if (nt?.$["default-x"] === lastNote.defaultXPos) {
                            lastNote.isChord = true;
                            lastNote.addToTimer = false;
                        }
                    }
                });

                // set the end of the repeater, if any
                if (
                    ms?.barline !== undefined &&
                    ms?.barline.length > 1 &&
                    ms?.barline[1].repeat !== undefined
                ) {
                    song.push({
                        repeater: true,
                        direction: ms.barline[1].repeat.$.direction,
                        measure: idx + 1,
                    });
                }

                // ending measure line
                song.push({
                    isLine: true,
                    location: "end",
                    show: false,
                    time: 0,
                    duration: 0,
                });
            });
            // getLastNoteLength();
            console.log(getOnlyNotesAndRests().length, getOnlyNotesAndRests());
            const cropSong = getOnlyNotesAndRests();
            const logNoteByNote = (cropSong) => {
                for (let i = 0; i < cropSong.length; i++) {
                    if (cropSong[i]?.isRest)
                        console.log(
                            cropSong[i].time,
                            "im a rest dont count me"
                        );
                    else if (cropSong[i]?.isChord)
                        console.log(
                            cropSong[i].time,
                            "im a chord!!!",
                            cropSong[i].pitch
                        );
                    else if (cropSong[i]?.tie?.$?.type === "start")
                        console.log(
                            cropSong[i].time,
                            "im the tie!!!",
                            cropSong[i].pitch
                        );
                    else console.log(cropSong[i].time, cropSong[i].pitch);
                }
            };
            logNoteByNote(cropSong);
            console.log("im a song ", song);
        });
    };
    parseXML();
};
