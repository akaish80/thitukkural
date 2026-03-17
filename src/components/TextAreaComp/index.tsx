
import type { ChangeEvent, RefObject } from 'react';

interface TextAreaCompProps {
    freeRef: RefObject<HTMLTextAreaElement | null>;
    freeText: string;
    setFreeText: (text: string) => void;
}



const replacements: Array<[RegExp, string]> = [
    [/a/g, "அ"],
    [/அஅ/g, "ஆ"],
    [/[āA]/g, "ஆ"],
    [/i/g, "இ"],
    [/இஇ/g, "ஈ"],
    [/[īI]/g, "ஈ"],
    [/u/g, "உ"],
    [/உஉ/g, "ஊ"],
    [/[ūU]/g, "ஊ"],
    [/e/g, "எ"],
    [/எஎ/g, "ஏ"],
    [/[ēE]/g, "ஏ"],
    [/அஇ/g, "ஐ"],
    [/o/g, "ஒ"],
    [/ஒஒ/g, "ஓ"],
    [/[ōO]/g, "ஓ"],
    [/அஉ/g, "ஔ"],

    // virama 
    [/ிஇ/g, "ீ"],
    [/ுஉ/g, "ூ"],
    [/ெஎ/g, "ே"],
    [/ொஒ/g, "ோ"],
    [/்அ/g, "\u200b"],
    [/\u200bஅ/g, "ா"],
    [/\u200bஇ/g, "ை"],
    [/\u200bஉ/g, "ௌ"],

    [/்ஆ/g, "ா"],
    [/்இ/g, "ி"],
    [/்ஈ/g, "ீ"],
    [/்உ/g, "ு"],
    [/்ஊ/g, "ூ"],
    [/்எ/g, "ெ"],
    [/்ஏ/g, "ே"],
    [/்ஒ/g, "ொ"],
    [/்ஓ/g, "ோ"],

    //cons
    [/[kg]/g, "க்"],
    [/[Gṅ]/g, "ங்"],
    [/c/g, "ச்"],
    [/j/g, "ஜ்"],
    [/[Jñ]/g, "ஞ்"],
    [/[td]/g, "த்"],
    [/[TDṭṬ]/g, "ட்"],
    [/n/g, "ந்"],
    [/[NṇṆ]/g, "ண்"],
    [/[bp]/g, "ப்"],
    [/m/g, "ம்"],
    [/y/g, "ய்"],
    [/r/g, "ர்"],
    [/l/g, "ல்"],
    [/[Lḷ]/g, "ள்"],
    [/v/g, "வ்"],
    [/ś/g, "ஶ்"],

    // gn, ny 
    [/ந்க்/g, "ங்"],
    [/ந்ய்/g, "ஞ்"],


    [/[çzśŚ]/g, "ஶ்"],
    [/s/g, "ஸ்"],
    [/[SṣṢ]/g, "ஷ்"],
    [/h/g, "ஹ்"],


    [/w/g, "௰"],
    [/௰'/g, "௱"],
    [/௱'/g, "௲"],

    // ḻa ṟa ṉa 

    [/ல்=/g, "ழ்"],
    [/ர்=/g, "ற்"],
    [/ந்=/g, "ன்"],
    [/ḻ/g, "ழ்"],
    [/ṟ/g, "ற்"],
    [/ṉ/g, "ன்"],

    // suppression zero
    [/\u200bக/g, "க"],
    [/\u200bங/g, "ங"],
    [/\u200bச/g, "ச"],
    [/\u200bஜ/g, "ஜ"],
    [/\u200bஞ/g, "ஞ"],
    [/\u200bட/g, "ட"],
    [/\u200bண/g, "ண"],
    [/\u200bத/g, "த"],
    [/\u200bந/g, "ந"],
    [/\u200bன/g, "ன"],
    [/\u200bப/g, "ப"],
    [/\u200bம/g, "ம"],
    [/\u200bய/g, "ய"],
    [/\u200bர/g, "ர"],
    [/\u200bற/g, "ற"],
    [/\u200bல/g, "ல"],
    [/\u200bள/g, "ள"],
    [/\u200bழ/g, "ழ"],
    [/\u200bவ/g, "வ"],
    [/\u200bஶ/g, "ஶ"],
    [/\u200bஷ/g, "ஷ"],
    [/\u200bஸ/g, "ஸ"],
    [/\u200bஹ/g, "ஹ"],

    // anusvara
    [/M/g, "ஂ"],
    // visarga
    [/[KH]/g, "ஃ"],
    [/்ஃ/g, "ஃ"],
    //OM
    [/ஓஂ/g, "ௐ"],
    // longueur au
    [/ௌஉ/g, "ௗ"],

    [/0/g, "௦"],
    [/1/g, "௧"],
    [/2/g, "௨"],
    [/3/g, "௩"],
    [/4/g, "௪"],
    [/5/g, "௫"],
    [/6/g, "௬"],
    [/7/g, "௭"],
    [/8/g, "௮"],
    [/9/g, "௯"],

    // ponctuation
    [/\|/g, "।"],
    [/\//g, "।"],
    [/।।/g, "॥"],

    // x pour zwj
    [/x/g, "\u200d"],
];


export const TextAreaComp = ({ freeRef, freeText, setFreeText }: TextAreaCompProps) => {
    const transform = (txt: string) => {
        let result = txt;
        for (const [regex, replacement] of replacements) {
            result = result.replace(regex, replacement);
        }
        return result;
    };

    const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = event.currentTarget;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const scrollTop = textarea.scrollTop;
        const originalText = textarea.value;
        const transformedText = transform(originalText);

        setFreeText(transformedText);

        // Restore selection after React applies the controlled value.
        requestAnimationFrame(() => {
            if (!freeRef.current) return;

            if (start === 0 && end === originalText.length) {
                freeRef.current.selectionStart = 0;
                freeRef.current.selectionEnd = transformedText.length;
            } else {
                const beforeCursorOriginal = transform(originalText.substring(0, start));
                freeRef.current.selectionStart = beforeCursorOriginal.length;
                freeRef.current.selectionEnd = beforeCursorOriginal.length;
            }

            freeRef.current.scrollTop = scrollTop;
        });
    };

    return (<textarea
        ref={freeRef}
        className="free-output"
        value={freeText}
        onChange={handleTextAreaChange}
        placeholder="Click keys below to type Tamil…"
        rows={4}
        spellCheck={false}
    />
    );
};

export default TextAreaComp;