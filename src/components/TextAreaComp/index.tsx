import { useRef } from 'react';
import type { ChangeEvent, KeyboardEvent, RefObject } from 'react';

interface TextAreaCompProps {
    freeRef: RefObject<HTMLTextAreaElement | null>;
    freeText: string;
    setFreeText: (text: string) => void;
}

// Transliteration mapping based on Branah Tamil keyboard (transliteration mode)
// Each key is a context string (up to 3 chars), value is the composed Tamil output.
// Compose checks: full 3-char match, then last 2 chars, then last 1 char.
const mapping: Record<string, string> = {
    // Standalone vowels (uppercase)
    "A": "அ",
    "I": "இ",
    "U": "உ",
    "E": "எ",
    "O": "ஒ",

    // Vowel signs and vowel combinations
    "a": "ா",
    "அA": "ஆ",
    "i": "ை",
    "்i": "ி",
    "ிi": "ீ",
    "இI": "ஈ",
    "u": "ௌ",
    "்u": "ு",
    "ுu": "ூ",
    "உU": "ஊ",
    "ெe": "ே",
    "e": "ெ",
    "எE": "ஏ",
    "்e": "ெ",
    "அI": "ஐ",
    "o": "ொ",
    "்o": "ொ",
    "ஒO": "ஓ",
    "ொo": "ோ",
    "அU": "ஔ",

    // Anusvara
    "ம்m": "ஂ",

    // Visarga
    "K": "ஃ",

    // Consonants
    "k": "க்",
    "க்a": "க",
    "க்h": "ஃக்",
    "ந்g": "ங்",
    "ங்a": "ங",
    "c": "ச்",
    "ச்a": "ச",
    "j": "ஜ்",
    "ஜ்a": "ஜ",
    "ந்y": "ஞ்",
    "ஞ்a": "ஞ",
    "த்t": "ட்",
    "ட்a": "ட",
    "ந்n": "ண்",
    "ண்a": "ண",
    "t": "த்",
    "த்a": "த",
    "n": "ந்",
    "ந்a": "ந",
    "p": "ப்",
    "ப்a": "ப",
    "m": "ம்",
    "ம்a": "ம",
    "y": "ய்",
    "ய்a": "ய",
    "r": "ர்",
    "ர்a": "ர",
    "l": "ல்",
    "ல்a": "ல",
    "ல்l": "ள்",
    "ள்a": "ள",
    "v": "வ்",
    "வ்a": "வ",
    "s": "ஸ்",
    "ஸ்a": "ஸ",
    "ஸ்s": "ஷ்",
    "ஷ்a": "ஷ",
    "ஸ்h": "ஶ்",
    "ஶ்a": "ஶ",
    "h": "ஹ்",
    "ஹ்a": "ஹ",

    // Special consonants (uppercase)
    "R": "ற்",
    "ற்a": "ற",
    "N": "ன்",
    "ன்a": "ன",
    "L": "ழ்",
    "ழ்a": "ழ",

    // Grantha / compound consonants
    "z": "ஃஜ்",
    "f": "ஃப்",
    "க்s": "க்ஷ்",

    // Pulli (virama) via apostrophe
    "'": "்",

    // Semicolon-prefixed reset keys (escape previous context)
    ";A": "அ",
    ";y": "ய்",
    ";m": "ம்",
    ";s": "ஷ்",
    ";h": "ஹ்",
    ";U": "உ",
    ";t": "த்",
    ";E": "எ",
    ";n": "ந்",
    ";'": "'",
    ";O": "ஒ",
    ";l": "ல்",
    ";I": "இ",

    // Tamil numerals (backtick-prefixed)
    "`0": "௦",
    "`1": "௧",
    "`2": "௨",
    "`3": "௩",
    "`4": "௪",
    "`5": "௫",
    "`6": "௬",
    "`7": "௭",
    "`8": "௮",
    "`9": "௯",
    "``": "௰",
    "`-": "௱",
    "`=": "௲",

    // Special symbols
    "$$": "௹",
    "DD": "௳",
    "MM": "௴",
    "YY": "௵",
    "DBT": "௶",
    "CT": "௷",
    "DGT": "௺",
};

export const compose = (v: string): string => {
    const len = v.length;
    if (len === 0) return "";
    if (mapping[v]) return mapping[v];
    if (len >= 2) {
        const last2 = v.substring(len - 2, len);
        if (mapping[last2] !== undefined) {
            return (len === 3 ? v.charAt(0) : "") + (mapping[last2] || "");
        }
        const last1 = v.charAt(len - 1);
        if (mapping[last1] !== undefined) {
            return v.substring(0, len - 1) + (mapping[last1] || "");
        }
    }
    return v;
};

const decompose = (ch: string): string => {
    if (ch.length === 0) return "";
    for (const key in mapping) {
        if (mapping[key] === ch) return key;
    }
    return ch;
};

/**
 * Insert a character into a text string at the given cursor position, then compose.
 * Returns { text, cursor } with the new content and new cursor position.
 */
export const insertAndCompose = (
    currentText: string,
    char: string,
    selStart: number,
    selEnd: number,
): { text: string; cursor: number } => {
    const before = currentText.substring(0, selStart);
    const after = currentText.substring(selEnd);
    const withInsert = before + char + after;
    const cursorAfterInsert = selStart + char.length;

    const windowStart = Math.max(0, cursorAfterInsert - 3);
    const window = withInsert.substring(windowStart, cursorAfterInsert);
    const composed = compose(window);

    const text = withInsert.substring(0, windowStart) + composed + withInsert.substring(cursorAfterInsert);
    const cursor = windowStart + composed.length;
    return { text, cursor };
};

export const TextAreaComp = ({ freeRef, freeText, setFreeText }: TextAreaCompProps) => {
    // Synchronous text ref — survives across rapid keystrokes even if React hasn't re-rendered
    const textRef = useRef(freeText);

    const updateText = (newText: string) => {
        textRef.current = newText;   // sync update (immediate)
        setFreeText(newText);        // async React state update
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        // Let modifier combinations (Ctrl+C, Ctrl+V, etc.) pass through
        if (event.ctrlKey || event.metaKey || event.altKey) return;

        const textarea = event.currentTarget;
        const currentText = textRef.current; // always up-to-date
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const scrollTop = textarea.scrollTop;

        if (event.key.length === 1) {
            // Printable character: intercept and compose
            event.preventDefault();

            const { text: result, cursor: newCursorPos } = insertAndCompose(currentText, event.key, start, end);

            updateText(result);
            requestAnimationFrame(() => {
                if (freeRef.current) {
                    freeRef.current.selectionStart = newCursorPos;
                    freeRef.current.selectionEnd = newCursorPos;
                    freeRef.current.scrollTop = scrollTop;
                }
            });
        } else if (event.key === 'Backspace') {
            event.preventDefault();

            if (start !== end) {
                // Selection exists: just delete the selected text
                const result = currentText.substring(0, start) + currentText.substring(end);
                updateText(result);
                requestAnimationFrame(() => {
                    if (freeRef.current) {
                        freeRef.current.selectionStart = start;
                        freeRef.current.selectionEnd = start;
                        freeRef.current.scrollTop = scrollTop;
                    }
                });
                return;
            }

            if (start === 0) return;

            // Delete the character before cursor
            const deletedChar = currentText.charAt(start - 1);
            let newText = currentText.substring(0, start - 1) + currentText.substring(start);
            let newCursorPos = start - 1;

            const decomposed = decompose(deletedChar);

            if (decomposed !== deletedChar) {
                // Character decomposes to transliteration keys: undo last keystroke
                const prevChar = newCursorPos > 0 ? newText.charAt(newCursorPos - 1) : "";
                const deleteFrom = prevChar ? newCursorPos - 1 : newCursorPos;
                const toRecompose = prevChar + decomposed.slice(0, -1);

                // Remove the previous char from text (if it exists)
                if (prevChar) {
                    newText = newText.substring(0, deleteFrom) + newText.substring(newCursorPos);
                    newCursorPos = deleteFrom;
                }

                // Recompose and insert
                if (toRecompose.length > 0) {
                    const recomposed = compose(toRecompose);
                    newText = newText.substring(0, newCursorPos) + recomposed + newText.substring(newCursorPos);
                    newCursorPos += recomposed.length;
                }
            }

            // If the deleted char was pulli (virama), also delete the consonant before it
            if (deletedChar === '\u0BCD' && newCursorPos > 0) {
                newText = newText.substring(0, newCursorPos - 1) + newText.substring(newCursorPos);
                newCursorPos -= 1;
            }

            updateText(newText);
            requestAnimationFrame(() => {
                if (freeRef.current) {
                    freeRef.current.selectionStart = newCursorPos;
                    freeRef.current.selectionEnd = newCursorPos;
                    freeRef.current.scrollTop = scrollTop;
                }
            });
        }
        // All other keys (Enter, Delete, arrows, etc.) pass through to browser + onChange
    };

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        // Handles paste, IME, Enter, Delete, and other inputs not caught by onKeyDown
        updateText(event.currentTarget.value);
    };

    return (
        <textarea
            ref={freeRef}
            className="free-output"
            value={freeText}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            placeholder="Click keys below to type Tamil…"
            rows={4}
            spellCheck={false}
        />
    );
};

export default TextAreaComp;
