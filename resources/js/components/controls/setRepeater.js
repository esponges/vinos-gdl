/* eslint-disable no-loop-func */
export const setAllRepeaters = (xmlSong) => {
    let repeatersCount = 0;

    for (let i = 0; i < xmlSong.length; i++) {
        if (
            xmlSong[i][0]?.repeater &&
            xmlSong[i][0]?.direction === "backward"
        ) {
            console.log("first repeater start with", i);
            repeatersCount += 1;
        }
    }

    const songsWithExpandedRepeaters = [];

    const pushExpandedSong = (i, song) => {
        const expandedSong = setRepeater(song, song[i][0], i);
        songsWithExpandedRepeaters.push(expandedSong);
        return expandedSong;
    };

    // use last song as reference
    let lastUpdatedSong = xmlSong;
    const ignoreRepeater = [];

    while (repeatersCount > 0) {
        for (let i = 0; i < lastUpdatedSong.length; i++) {
            if (
                lastUpdatedSong[i][0]?.repeater &&
                lastUpdatedSong[i][0]?.direction === "backward" &&
                lastUpdatedSong[i][0]?.repeaterCount >= 1 &&
                !ignoreRepeater.includes(i)
            ) {
                // push song to array of expanded songs
                lastUpdatedSong = pushExpandedSong(i, lastUpdatedSong);

                // ignore this repeater next loop
                ignoreRepeater.push(i);
                repeatersCount -= 1;
                break;
            }
        }
    }
    console.log(songsWithExpandedRepeaters);

    return songsWithExpandedRepeaters;
};

const pushRepeater = (backward = false) => {
    lastNoteId += 1;

    return [
        {
            repeater: true,
            repeaterCount: Math.random(),
            direction: backward ? "forward" : "backward",
            color: "white",
            duration: 0,
            time: 0,
            offset: 0,
            show: false,
            measure: null,
            id: lastNoteId,
        },
    ];
};

let timeCounter = 0;
const bpm = 120;

const getNoteMsDuration = (note) => {
    const msPerBeat = 60 / bpm;

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

    let msDuration;
    switch (note.duration) {
        case "complete":
            msDuration = !note.dot
                ? noteLength.complete
                : noteLength.complete * 1.5;
            break;
        case "whole":
            msDuration = !note.dot ? noteLength.whole : noteLength.whole * 1.5;
            break;
        case "half":
            msDuration = !note.dot ? noteLength.half : noteLength.half * 1.5;
            break;
        case "quarter":
            msDuration = !note.dot
                ? noteLength.quarter
                : noteLength.quarter * 1.5;
            break;
        case "eighth":
            msDuration = !note.dot
                ? noteLength.eighth
                : noteLength.eighth * 1.5;
            break;
        case "16th":
            msDuration = !note.dot
                ? noteLength["16th"]
                : noteLength["16th"] * 1.5;
            break;
        case "32th":
            msDuration = !note.dot
                ? noteLength["32th"]
                : noteLength.complete * 1.5;
            break;
        default:
            break;
    }
    return msDuration;
};

let lastNoteId = 0;

/* eq to timeCounter from parse */
const getLastNoteTime = (sectionBefore) => {
    let buffer = 0;

    for (let i = sectionBefore.length - 4; i < sectionBefore.length; i++) {
        if (sectionBefore[i][0].time >= buffer) {
            buffer = sectionBefore[i][0].time;
            timeCounter = getNoteMsDuration(sectionBefore[i][0]) + buffer;
            // eslint-disable-next-line radix
            lastNoteId = parseInt(sectionBefore[i].map((note) => note.id));
        }
    }

    return timeCounter;
};

const updateSectionTime = (section, isExpanded = false) => {
    const updatedSection = [];
    // paint first note if expanded section
    let paint = isExpanded;

    if (isExpanded) {
        pushRepeater(true);
    }

    for (let i = 0; i < section.length; i++) {
        // eslint-disable-next-line array-callback-return
        section[i].map((note) => {
            lastNoteId += 1;
            if (note.defaultXPos || note.isRest) {
                updatedSection.push([
                    {
                        ...note,
                        color: paint ? "black" : "white",
                        time: timeCounter,
                        id: lastNoteId,
                    },
                ]);
                paint = false;
                timeCounter += getNoteMsDuration(note);
            } else {
                updatedSection.push([
                    {
                        ...note,
                        id: lastNoteId,
                    },
                ]);
            }
        });
    }

    if (isExpanded) {
        pushRepeater(false);
    }

    return updatedSection;
};

export const setRepeater = (
    song,
    repeater /* backward repeater */,
    idx /* repeater idx */
) => {
    let mutatingSong;
    const repeaterEndCount = repeater.repeaterCount;

    for (let i = 0; i < idx; i++) {
        // set the start of the expanded section
        if (song[i][0]?.repeaterCount === repeaterEndCount - 1) {
            const sectionStart = i + 1;

            const firstSection = song.slice(0, idx + 1);
            getLastNoteTime(firstSection); // update timeCounter

            const section = song.slice(sectionStart, idx);
            const sectionTimeUpdated = updateSectionTime(section, true);

            const secondSection = song.slice(idx + 1, song.length);
            const secondSectionTimeUpdated = updateSectionTime(
                secondSection,
                false
            );

            mutatingSong = [
                ...firstSection,
                ...sectionTimeUpdated,
                ...secondSectionTimeUpdated,
            ];
            break;
        }
    }
    return mutatingSong;
};
