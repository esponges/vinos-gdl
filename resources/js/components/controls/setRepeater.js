import { v4 } from "uuid";

export const setAllRepeaters = (xmlSong) => {

    let repeatersCount = 0;

    for(let i = 0; i < xmlSong.length; i++) {
        if(xmlSong[i][0]?.repeater && xmlSong[i][0]?.direction === 'backward') {
            repeatersCount++;
        }
    }
    console.log(repeatersCount);

        let songsWithExpandedRepeaters = [];

    const pushExpandedSong = (i, song) => {
        console.log('song is', song, 'i is ', i);
        const expandedSong = setRepeater(
            song,
            song[i][0],
            i
        );
        songsWithExpandedRepeaters.push(expandedSong);
        return expandedSong;
    }

    let lastUpdatedSong = xmlSong;
    let ignoreRepeater = [];

    // console.log(ignoreRepeater.indexOf(3));

    while (repeatersCount > 0) {
        for (let i = 0; i < lastUpdatedSong.length; i++) {
            // console.log('forrrr', i);
            if(lastUpdatedSong[i][0]?.repeater && lastUpdatedSong[i][0]?.direction === 'backward' && lastUpdatedSong[i][0]?.repeaterCount >= 1 && !ignoreRepeater.includes(i) ) {
                // console.log('found it! its ', i);
                // push song to array of expanded songs
                lastUpdatedSong = pushExpandedSong(i, lastUpdatedSong);
                // ignore this repeater next loop
                ignoreRepeater.push(i);
                repeatersCount --;
                break;
            }
        };
    }

    console.log('are these', songsWithExpandedRepeaters);

    return songsWithExpandedRepeaters;
};

const pushRepeater = (backward = false) => {
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
            msDuration = !note.dot
                ? noteLength.whole
                : noteLength.whole * 1.5;
        break;
        case "half":
            msDuration = !note.dot
                ? noteLength.half
                : noteLength.half * 1.5;
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
}

let lastNoteId = 0;
/* eq to timeCounter from parse */
const getLastNoteTime = (sectionBefore) => {
    // console.log('sectionBefore is', sectionBefore);
    let buffer = 0;
    // const time = sectionBefore[sectionBefore.length - 2][0].time;
    // sectionBefore.map(note => {
    //     if (note[0].time > m) {
    //         m = note[0].time;
    //         console.log('new time!!', m);
    //     }
    // })
    for (let i = sectionBefore.length - 4; i < sectionBefore.length; i++) {
        if (sectionBefore[i][0].time >= buffer) {
            buffer = sectionBefore[i][0].time;
            timeCounter = getNoteMsDuration(sectionBefore[i][0])+ buffer;
            lastNoteId = parseInt(sectionBefore[i].map(note => note.id));
        }
    }
    console.log('last note id is ', lastNoteId);
    // console.log('time counter is ', timeCounter);
    return timeCounter;
    // console.log('m is!!', buffer);
    // const timeToAdd = sectionBefore[sectionBefore.length - 2][0].duration;
    // const newTime = time + timeToAdd;
    // console.log("time is!!!", time, sectionBefore[sectionBefore.length - 2]);
};

// const getLastNoteMsDuration = (section) => {
//     // console.log('section is', section);

//     let lastNoteDuration;
//     let hasDot;
//     const range = section.length > 3 ? 4 : 0;
//     for(let i = range; i < section.length; i++) {
//         if(section[i][0].time || section[i][0].isRest){
//             lastNoteDuration = section[i][0].duration;
//             hasDot = section[i][0].dot;
//             break;
//         }
//     }
//     const updatedNoteTime = incrementTimer(lastNoteDuration, hasDot, 120);

//     return updatedNoteTime;
// }

// const updateNotesTime = (actualSection, lastSection = false) => {
//     console.log("hey update this time!!", actualSection);

//     const newTime = getLastNoteMsDuration(lastSection); //get note ms from last section

//     const updatedSection = [];
//     let m = 0;
//     for (let i = 0; i < actualSection.length; i++) {
//         if (actualSection[i][0].time || actualSection[i][0].isRest) {
//             m += 1;
//             // console.log('m equals to!', m);
//             // console.log('updatedSection is', updatedSection);

//             let updatedNote = [];
//             actualSection[i].map((note) => {

//                 updatedNote = [{
//                     ...note,
//                     time: m === 1 ? newTime : getLastNoteMsDuration(updatedSection),
//                     id: note.id = v4(),
//                 }];
//                 updatedSection.push( updatedNote );
//             });
//         } else {

//         }
//     }
//     return updatedSection;
// };

const updateSectionTime = (section, isExpanded = false) => {

    let updatedSection = [];
    // paint first note if expanded section
    let paint = isExpanded;

    for(let i = 0; i < section.length; i++) {
        section[i].map(note => {
            lastNoteId += 1;
            if (note.defaultXPos || note.isRest) {
                updatedSection.push([{
                    ...note,
                    color: paint ? 'black' : 'white',
                    time: timeCounter,
                    id: lastNoteId,
                }]);
                paint = false;
                timeCounter += getNoteMsDuration(note);
            } else {
                updatedSection.push([{
                    ...note,
                    id: lastNoteId,
                }]);
            }
        });
    }
    console.log('the updated section ', updatedSection);
    return updatedSection;
}


export const setRepeater = (
    song,
    repeater /* backward repeater */,
    idx /* repeater idx */
) => {
    let mutatingSong;
    // console.log('this is the song', song);
    // console.log('song!!!', song[81])
    // console.log(repeater, repeater?.repeaterCount, "and idx is", idx);
    const repeaterEndCount = repeater.repeaterCount;
    // console.log("repeaterEndCount is", repeaterEndCount);
    for (let i = 0; i < idx; i++) {
        // console.log('for loop and i is', i, 'and note is ',);
        if (song[i][0]?.repeaterCount === repeaterEndCount - 1) {
            let sectionStart = i + 1;
            // console.log("here we start the section", i, song[i + 1], 'and we end it', idx, 'and sectionStart is', sectionStart);
            // console.log('this is the actual section', section);
            const firstSection = song.slice(0, idx + 1);

            // console.log('slice from ', idx + 1, 'to ', song.length);

            getLastNoteTime(firstSection); // update timeCounter
            const section = song.slice(sectionStart, idx);
            const sectionTimeUpdated = updateSectionTime(section, true);
            // console.log('first section vs section', firstSection, section);

            // console.log('first section is ', firstSection);
            // getLastNoteTime(sectionTimeUpdated);
            // console.log("second section!!!", secondSection);
            const secondSection = song.slice(idx + 1, song.length);
            // console.log('the second section is ', secondSection);
            const secondSectionTimeUpdated = updateSectionTime(secondSection, false);
            // console.log(
            //     "updated time looks like this ",
            //     secondSectionTimeUpdated
            // );
            mutatingSong = [
                ...firstSection,
                pushRepeater(true),
                ...sectionTimeUpdated,
                pushRepeater(false),
                ...secondSectionTimeUpdated,
            ];
            break;
        }
    }
    console.log("this is the song like", mutatingSong);
    return mutatingSong;
};
