import type { KeyDef, DeadKeyDef } from '../components/VirtualKeyboard/keyboardLayouts';

/**
 * Get the key state string based on modifier key states.
 * Returns: 'n' (normal), 's' (shift), 't' (ctrl), 'f' (ctrl+shift),
 *          'y' (caps SGCap), 'z' (caps+shift SGCap)
 */
export function getKeyState(
  ctrl: boolean,
  alt: boolean,
  shift: boolean,
  caps: boolean,
  capsType: string,
  altGr: boolean
): string {
  let state = 'n';
  if (!alt && !shift && ctrl) state = 'n';
  else if (!alt && shift && !ctrl) state = 's';
  else if (!alt && shift && ctrl) state = 's';
  else if (alt && !shift && !ctrl) state = 'n';
  else if (alt && !shift && ctrl) state = 't';
  else if (alt && shift && !ctrl) state = 's';
  else if (alt && shift && ctrl) state = 'f';

  if (caps) {
    if (capsType === '1') {
      if (state === 'n') state = 's';
      else if (state === 's') state = 'n';
    } else if (capsType === 'SGCap') {
      if (state === 'n') state = 'y';
      else if (state === 's') state = 'z';
    }
  }

  if (altGr) {
    if (state === 'n') state = 't';
    else if (state === 's') state = 'f';
  }

  return state;
}

export function getKeyLegend(keys: KeyDef[], keyId: string): string {
  for (const key of keys) {
    if (key.i === keyId) return key.n || '';
  }
  return '';
}

export function getKey(keys: KeyDef[], keyId: string): KeyDef | null {
  for (const key of keys) {
    if (key.i === keyId) return key;
  }
  return null;
}

export function isDeadkey(deadkeys: DeadKeyDef[], char: string): boolean {
  if (!deadkeys) return false;
  return deadkeys.some((dk) => dk.k === char);
}

export function getMappedDeadkeyValue(
  deadkeys: DeadKeyDef[],
  base: string,
  deadChar: string
): string {
  if (!deadkeys) return '';
  for (const dk of deadkeys) {
    if (dk.k === deadChar && dk.b === base) return dk.c;
  }
  return '';
}

/** Physical key code to layout key index mapping */
export const physicalKeyToIndex: Record<string, number> = {
  Backquote: 0, Digit1: 1, Digit2: 2, Digit3: 3, Digit4: 4,
  Digit5: 5, Digit6: 6, Digit7: 7, Digit8: 8, Digit9: 9,
  Digit0: 10, Minus: 11, Equal: 12,
  KeyQ: 13, KeyW: 14, KeyE: 15, KeyR: 16, KeyT: 17,
  KeyY: 18, KeyU: 19, KeyI: 20, KeyO: 21, KeyP: 22,
  BracketLeft: 23, BracketRight: 24, Backslash: 25,
  KeyA: 26, KeyS: 27, KeyD: 28, KeyF: 29, KeyG: 30,
  KeyH: 31, KeyJ: 32, KeyK: 33, KeyL: 34,
  Semicolon: 35, Quote: 36,
  KeyZ: 37, KeyX: 38, KeyC: 39, KeyV: 40,
  KeyB: 41, KeyN: 42, KeyM: 43,
  Comma: 44, Period: 45, Slash: 46,
  IntlBackslash: 47,
};

/** Transliteration mapping for Tamil */
export const transliterationMapping: Record<string, string> = {
  A: 'அ', a: 'ா', 'அA': 'ஆ',
  I: 'இ', i: 'ை', '्i': 'ி', 'ிi': 'ீ', 'இI': 'ஈ',
  U: 'உ', u: 'ௌ', '்u': 'ு', 'ுu': 'ூ', 'உU': 'ஊ',
  'ெe': 'ே', E: 'எ', e: 'ெ', 'எE': 'ஏ', '्e': 'ெ',
  'அI': 'ஐ',
  O: 'ஒ', o: 'ொ', '्o': 'ொ', 'ഒO': 'ஓ', 'ொo': 'ோ',
  'அU': 'ஔ',
  'ம்m': 'ஂ',
  K: 'ஃ',
  k: 'க்', 'க்a': 'க', 'க்h': 'ஃக்',
  'ந்g': 'ங்', 'ங்a': 'ங',
  c: 'ச்', 'ச்a': 'ச',
  'ஜ்a': 'ஜ', j: 'ஜ்',
  'ஞ்a': 'ஞ', 'ந்y': 'ஞ்',
  'த்t': 'ட்', 'ட்a': 'ட',
  'ண்a': 'ண', 'ந்n': 'ண்',
  t: 'த்', 'த்a': 'த',
  n: 'ந்', 'ந்a': 'ந',
  p: 'ப்', 'ப்a': 'ப',
  m: 'ம்', 'ம்a': 'ம',
  R: 'ற்', 'ற்a': 'ற',
  N: 'ன்', 'ன்a': 'ன',
  'ழ்a': 'ழ', L: 'ழ்',
  y: 'ய்', 'ய்a': 'ய',
  'ர்a': 'ர', r: 'ர்',
  'ல்a': 'ல', l: 'ல்',
  z: 'ஃஜ்',
  'ல்l': 'ள்', 'ள்a': 'ள',
  'வ்a': 'வ', f: 'ஃப்', v: 'வ்',
  'ஶ்a': 'ஶ', 'ஸ்h': 'ஶ்',
  'ஷ்a': 'ஷ', 'ஸ்s': 'ஷ்',
  'ஸ்a': 'ஸ', s: 'ஸ்',
  'ஹ்a': 'ஹ', h: 'ஹ்',
  'க்s': 'க்ஷ்',
  ';A': 'அ', ';y': 'ய்', ';m': 'ம்', ';s': 'ஷ்', ';h': 'ஹ்',
  ';U': 'உ', ';t': 'த்', ';E': 'எ', ';n': 'ந்', ";'": "'",
  ';O': 'ஒ', ';l': 'ல்', ';I': 'இ',
  '`0': '௦', '`1': '௧', '`2': '௨', '`3': '௩', '`4': '௪',
  '`5': '௫', '`6': '௬', '`7': '௭', '`8': '௮', '`9': '௯',
  '``': '௰', '`-': '௱', '`=': '௲',
  '$$': '௹',
  "'": '்',
  DD: '௳', MM: '௴', YY: '௵',
  DBT: '௶', CT: '௷', DGT: '௺', QT: 'வ', DT: 'ள',
};

/** Compose transliteration: given a string of recent chars, produce composed Tamil */
export function transliterateCompose(input: string): string {
  const len = input.length;
  if (len === 0) return '';

  if (transliterationMapping[input]) {
    return transliterationMapping[input];
  }

  if (len >= 2) {
    const last2 = input.substring(len - 2, len);
    if (transliterationMapping[last2] !== undefined) {
      return (len === 3 ? input.charAt(0) : '') + (transliterationMapping[last2] || '');
    }
    const last1 = input.charAt(len - 1);
    if (transliterationMapping[last1] !== undefined) {
      return input.substring(0, len - 1) + (transliterationMapping[last1] || '');
    }
  }

  return input;
}

/** Decompose a Tamil character back to transliteration input */
export function transliterateDecompose(text: string): string {
  let result = '';
  for (const ch of text) {
    let found = '';
    for (const key in transliterationMapping) {
      if (transliterationMapping[key] === ch) {
        found = key;
        break;
      }
    }
    result += found || ch;
  }
  return result;
}

/** Tamil99 Brahmi composition */
const tamil99Vowels = [2950, 2951, 2952, 2953, 2954, 2958, 2959, 2960, 2962, 2963, 2964];
const tamil99Modifiers = [3006, 3007, 3008, 3009, 3010, 3014, 3015, 3016, 3018, 3019, 3020];
const tamil99Consonants = [
  2965, 2969, 2970, 2974, 2975, 2979, 2980, 2984, 2985, 2986, 2990, 2991,
  2992, 2993, 2994, 2995, 2996, 2997, 2998, 2972, 2999, 3000, 3001,
];

function composeBrahmi(
  vowels: number[],
  modifiers: number[],
  consonants: number[],
  text: string
): string {
  if (text.length === 0) return '';

  let prevCode = text.charCodeAt(0);
  let result = String.fromCharCode(prevCode);

  for (let i = 1; i < text.length; i++) {
    let code = text.charCodeAt(i);
    const vowelIdx = vowels.indexOf(code);

    if (consonants.indexOf(prevCode) !== -1 && vowelIdx !== -1) {
      code = modifiers[vowelIdx];
    }

    if (prevCode === 39 && vowelIdx !== -1) {
      result = result.slice(0, result.length - 1);
    }

    prevCode = code;
    result += String.fromCharCode(code);
  }

  return result;
}

export function tamil99Compose(text: string): string {
  return composeBrahmi(tamil99Vowels, tamil99Modifiers, tamil99Consonants, text);
}

/** Convert code point to string, handling surrogate pairs */
export function fromCharCodeSafe(...codes: number[]): string {
  let result = '';
  for (const code of codes) {
    if (code < 1114112 && code > 65535) {
      const hi = Math.floor((code - 65536) / 1024) + 55296;
      const lo = ((code - 65536) % 1024) + 56320;
      result += String.fromCharCode(hi, lo);
    } else if (code < 65536) {
      result += String.fromCharCode(code);
    }
  }
  return result;
}
