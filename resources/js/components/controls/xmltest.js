// const xmlFileUrl = "http://127.0.0.1:8000/Arkansas-Traveller.musicxml";
// const xmlFileUrl = "http://127.0.0.1:8000/Black-Mountain-Rag.musicxml";
// const xmlFileUrl = "http://127.0.0.1:8000/Billy-in-the-Lowground.musicxml";
const xmlFileUrl = "http://127.0.0.1:8000/Wayfaring_Stranger-upload-uncompressed-musicxml-1bar-count-in-120BPM.musicxml";
// const xmlFileUrl = "http://127.0.0.1:8000/Blue-Moon-of-Kentucky.musicxml";
import { parseString } from "xml2js";

export const fetchXML = async () => {

    const loadXML = async () => {
        const result = await fetch(xmlFileUrl);
        if (!result.ok) {
            console.error("Error fetching file");
            return;
        }

        const xml = await result.text();
        parseString(xml, { explicitArray: false }, (error, result) => {
            console.dir(result);

            const parsedSong = result;
            let song = [];

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
                ms.note.map((nt) => {
                    let lastNote = song[song.length - 1];

                    // check if note is rest -silence- note
                    if (nt?.rest === "" || nt?.rest) {
                        // only if rest is staff == 1 add
                        // otherwise there's repetition of the note
                        if (nt.staff == 1) {
                            song.push({
                                isRest: true,
                                dot: nt?.dot === "" ? setDotValue(nt) : false,
                                duration: nt?.type ?? 'complete',
                                measure: idx + 1,
                                staff: nt?.staff ?? false,
                            });
                        }
                    }

                    // check if it's tab note
                    if (nt?.notations?.technical?.fret !== undefined) {
                        song.push({
                            defaultXPos: nt?.$["default-x"],
                            isChord:
                                nt?.$["default-x"] === lastNote.defaultXPos
                                    ? true
                                    : false,
                            tie: nt?.tie ?? false,
                            pitch: `${nt?.pitch?.step}${nt?.pitch?.octave}`,
                            dot: nt?.dot === "" ? setDotValue(nt) : false,
                            fret: nt?.notations?.technical?.fret,
                            string: nt?.notations?.technical?.string,
                            duration: nt?.type,
                            measure: idx + 1,
                        });
                        if (nt?.$["default-x"] === lastNote.defaultXPos)
                            lastNote.isChord = true;
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

                // // search for back rest components (avoid double rest)
                // if (ms?.backup) {
                //     const restEls = song.filter(el => el?.isRest)
                //     console.log(restEls);
                // }
            });
            console.log("im a song ", song);

        });
    };
    loadXML();

    // Dot value extends the note duration by half
    // e.g. if it's quarter is duration will be
    // quarter + eighth (5/16)
    const setDotValue = (note) => {
        // console.log('note duration is', note.type);
        switch (note.type) {
            case "half":
                return "quarter";
            case "quarter":
                return "eighth";
            case "eighth":
                return "16th";
        }
    };
    // const parsedXmlSong = await loadXML();

    // const filterXml = parsedXmlSong;

    // console.log('parsed song', filterXml);
};
