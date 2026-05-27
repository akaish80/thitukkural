import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  layouts,
  defaultLayout as defaultLayoutData,
} from './keyboardLayouts';
import type { LayoutData, KeyDef } from './keyboardLayouts';
import {
  getKeyState,
  getKeyLegend,
  getKey,
  isDeadkey,
  getMappedDeadkeyValue,
  physicalKeyToIndex,
  transliterateCompose,
  transliterateDecompose,
  tamil99Compose,
  fromCharCodeSafe,
} from '../../utils/keyboardUtils';
import './VirtualKeyboard.scss';

const STORAGE_KEY = 'tamil';
const EMOJI_START = 128512;

interface KeyboardState {
  shift: boolean;
  caps: boolean;
  alt: boolean;
  altGr: boolean;
  ctrl: boolean;
  prev: string;
}

interface StoredState {
  layout: string | null;
  undo: string[];
  redo: string[];
  fontSize: number;
}

function loadStoredState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        layout: parsed.layout || null,
        undo: parsed.undo || [],
        redo: parsed.redo || [],
        fontSize: parsed.fontSize || 18,
      };
    }
  } catch {}
  return { layout: null, undo: [], redo: [], fontSize: 18 };
}

function saveStoredState(state: StoredState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

// Keyboard row definitions for desktop layout
const ROW_NUMBER = Array.from({ length: 13 }, (_, i) => i); // k0-k12
const ROW_TOP = Array.from({ length: 12 }, (_, i) => i + 13); // k13-k24
const ROW_HOME = Array.from({ length: 11 }, (_, i) => i + 26); // k26-k36
const ROW_BOTTOM_EXTRA = [47]; // k47
const ROW_BOTTOM = Array.from({ length: 10 }, (_, i) => i + 37); // k37-k46

// Mobile layout: compact 3-row letter grid (mirrors Branah mobile)
const MOB_ROW_1 = Array.from({ length: 10 }, (_, i) => i + 13); // k13-k22 (Q-P)
const MOB_ROW_2 = Array.from({ length: 9 }, (_, i) => i + 26);  // k26-k34 (A-L)
const MOB_ROW_3 = Array.from({ length: 7 }, (_, i) => i + 37);  // k37-k43 (Z-M)
// Extra keys shown in a collapsible row on mobile
const MOB_ROW_EXTRA = [
  ...Array.from({ length: 13 }, (_, i) => i),  // k0-k12 (numbers)
  23, 24, 25, 35, 36, 44, 45, 46, 47,          // punctuation
];

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= breakpoint
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);
  return isMobile;
}

export default function VirtualKeyboard() {
  const isMobile = useIsMobile();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState('');
  const [selectedLayoutId, setSelectedLayoutId] = useState<string>(() => {
    const stored = loadStoredState();
    return stored.layout || layouts[0].id;
  });
  const [fontSize, setFontSize] = useState(() => loadStoredState().fontSize);
  const [modifiers, setModifiers] = useState<KeyboardState>({
    shift: false, caps: false, alt: false, altGr: false, ctrl: false, prev: '',
  });
  const [isVirtualActive, setIsVirtualActive] = useState(true);
  const [showEmoji, setShowEmoji] = useState(false);
  const [emojiCodePoint, setEmojiCodePoint] = useState(EMOJI_START);
  const [showExtraKeys, setShowExtraKeys] = useState(false);
  const [hoverShift, setHoverShift] = useState(false);
  const [hoverCaps, setHoverCaps] = useState(false);
  const [hoverAltCtrl, setHoverAltCtrl] = useState(false);
  const [hoverAltGr, setHoverAltGr] = useState(false);

  const undoStack = useRef<string[]>(loadStoredState().undo);
  const redoStack = useRef<string[]>(loadStoredState().redo);

  const virtualLayout: LayoutData = useMemo(() => {
    const found = layouts.find((l) => l.id === selectedLayoutId);
    if (!found) return layouts[0].json;
    if (found.id === 'transliterate') {
      return { ...defaultLayoutData, dir: layouts[0].json.dir };
    }
    return found.json;
  }, [selectedLayoutId]);

  const currentLayout = isVirtualActive ? virtualLayout : defaultLayoutData;

  // Persist state
  useEffect(() => {
    const stored = loadStoredState();
    stored.layout = selectedLayoutId;
    stored.fontSize = fontSize;
    saveStoredState(stored);
  }, [selectedLayoutId, fontSize]);

  // Auto-save undo every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const val = text;
      if (undoStack.current.length === 0 && val.length === 0) return;
      if (undoStack.current.length === 0 || val !== undoStack.current[undoStack.current.length - 1]) {
        undoStack.current.push(val);
        const stored = loadStoredState();
        stored.undo = undoStack.current;
        saveStoredState(stored);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [text]);

  // Restore text from undo stack on mount
  useEffect(() => {
    const stored = loadStoredState();
    if (stored.undo.length > 0) {
      setText(stored.undo[stored.undo.length - 1]);
    }
  }, []);

  const insertAtCaret = useCallback((chars: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const val = ta.value;
    const newVal = val.substring(0, start) + chars + val.substring(end);
    setText(newVal);
    requestAnimationFrame(() => {
      ta.selectionStart = ta.selectionEnd = start + chars.length;
      ta.focus();
    });
  }, []);

  const handleKey = useCallback((keyId: string) => {
    const keyDef = getKey(currentLayout.keys, keyId);
    if (!keyDef) return;

    const state = getKeyState(
      modifiers.ctrl, modifiers.alt, modifiers.shift,
      modifiers.caps, keyDef.c || '0', modifiers.altGr
    );
    const char = (keyDef as unknown as Record<string, string>)[state] || '';

    if (modifiers.prev !== '') {
      const mapped = getMappedDeadkeyValue(currentLayout.deadkeys, char, modifiers.prev);
      if (mapped) insertAtCaret(mapped);
      setModifiers((m) => ({ ...m, prev: '' }));
    } else if (isDeadkey(currentLayout.deadkeys, char)) {
      setModifiers((m) => ({ ...m, prev: char }));
    } else if (char) {
      // Apply composition based on layout
      insertAtCaret(char);

      // After inserting, apply composition
      const ta = textareaRef.current;
      if (ta) {
        requestAnimationFrame(() => {
          const curPos = ta.selectionStart;
          const val = ta.value;
          if (selectedLayoutId === 'tamil99') {
            const lookback = Math.min(2, curPos);
            const chunk = val.substring(curPos - lookback, curPos);
            const composed = tamil99Compose(chunk);
            if (composed !== chunk) {
              const newVal = val.substring(0, curPos - lookback) + composed + val.substring(curPos);
              setText(newVal);
              requestAnimationFrame(() => {
                ta.selectionStart = ta.selectionEnd = curPos - lookback + composed.length;
                ta.focus();
              });
            }
          } else if (selectedLayoutId === 'transliterate') {
            const lookback = Math.min(3, curPos);
            const chunk = val.substring(curPos - lookback, curPos);
            const composed = transliterateCompose(chunk);
            if (composed !== chunk) {
              const newVal = val.substring(0, curPos - lookback) + composed + val.substring(curPos);
              setText(newVal);
              requestAnimationFrame(() => {
                ta.selectionStart = ta.selectionEnd = curPos - lookback + composed.length;
                ta.focus();
              });
            }
          }
        });
      }
    }
  }, [currentLayout, modifiers, insertAtCaret, selectedLayoutId]);

  const handleBackspace = useCallback(() => {
    if (modifiers.prev !== '') {
      setModifiers((m) => ({ ...m, prev: '', shift: false }));
      return;
    }

    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const val = ta.value;

    if (start === end && start > 0) {
      let deleteCount = 1;
      const charCode = val.charCodeAt(start - 1);
      // Handle surrogate pairs
      if (charCode >= 56320 && charCode <= 57343 && start >= 2) {
        deleteCount = 2;
      }

      const deleted = val.substring(start - deleteCount, start);
      const newVal = val.substring(0, start - deleteCount) + val.substring(end);
      setText(newVal);

      // Transliteration backspace decompose
      if (selectedLayoutId === 'transliterate' && deleted.length === 1) {
        const decomposed = transliterateDecompose(deleted);
        if (decomposed !== deleted) {
          requestAnimationFrame(() => {
            const cStart = ta.selectionStart;
            const cVal = ta.value;
            const prevChar = cVal.substring(Math.max(0, cStart - 1), cStart);
            const combined = prevChar + decomposed;
            const recomposed = transliterateCompose(combined.slice(0, -1));
            const newVal2 = cVal.substring(0, cStart - 1) + recomposed + cVal.substring(cStart);
            setText(newVal2);
            requestAnimationFrame(() => {
              ta.selectionStart = ta.selectionEnd = cStart - 1 + recomposed.length;
            });
          });
        }
        if (deleted === '\u0BCD') {
          // Pulli - delete one more character
          requestAnimationFrame(() => {
            const cStart = ta.selectionStart;
            const cVal = ta.value;
            if (cStart > 0) {
              const nv = cVal.substring(0, cStart - 1) + cVal.substring(cStart);
              setText(nv);
              requestAnimationFrame(() => {
                ta.selectionStart = ta.selectionEnd = cStart - 1;
              });
            }
          });
        }
      }

      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start - deleteCount;
        ta.focus();
      });
    } else if (start !== end) {
      const newVal = val.substring(0, start) + val.substring(end);
      setText(newVal);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start;
        ta.focus();
      });
    }
  }, [modifiers.prev, selectedLayoutId]);

  const handleEnter = useCallback(() => {
    insertAtCaret('\n');
  }, [insertAtCaret]);

  const handleSpace = useCallback(() => {
    insertAtCaret(' ');
  }, [insertAtCaret]);

  const handleEmojiKey = useCallback((index: number) => {
    insertAtCaret(fromCharCodeSafe(emojiCodePoint + index));
  }, [emojiCodePoint, insertAtCaret]);

  // Physical keyboard handler
  const handlePhysicalKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isVirtualActive && e.code !== 'Escape') return;

    // Allow Ctrl+A/C/V/X/Y/Z
    if (['KeyA', 'KeyY', 'KeyZ', 'KeyC', 'KeyV', 'KeyX'].includes(e.code) &&
        modifiers.ctrl && !modifiers.alt && !modifiers.shift) {
      return;
    }

    switch (e.code) {
      case 'ShiftLeft':
      case 'ShiftRight':
        setModifiers((m) => ({ ...m, shift: !m.shift }));
        e.preventDefault();
        break;
      case 'ControlLeft':
      case 'ControlRight':
        setModifiers((m) => ({ ...m, ctrl: !m.ctrl }));
        e.preventDefault();
        break;
      case 'AltLeft':
        setModifiers((m) => ({ ...m, alt: !m.alt }));
        e.preventDefault();
        break;
      case 'AltRight':
        setModifiers((m) => ({ ...m, altGr: !m.altGr }));
        e.preventDefault();
        break;
      case 'Escape':
        setIsVirtualActive((v) => !v);
        e.preventDefault();
        break;
      case 'CapsLock':
        setModifiers((m) => ({ ...m, caps: !m.caps }));
        e.preventDefault();
        break;
      case 'Backspace':
        handleBackspace();
        e.preventDefault();
        break;
      case 'Space':
        handleSpace();
        e.preventDefault();
        break;
      case 'Enter':
        handleEnter();
        e.preventDefault();
        break;
      default: {
        const idx = physicalKeyToIndex[e.code];
        if (idx !== undefined) {
          handleKey('k' + idx);
          e.preventDefault();
        }
        break;
      }
    }
  }, [isVirtualActive, modifiers, handleBackspace, handleSpace, handleEnter, handleKey]);

  const handlePhysicalKeyUp = useCallback((e: React.KeyboardEvent) => {
    switch (e.code) {
      case 'ShiftLeft':
      case 'ShiftRight':
        setModifiers((m) => ({ ...m, shift: !m.shift }));
        break;
      case 'ControlLeft':
      case 'ControlRight':
        setModifiers((m) => ({ ...m, ctrl: !m.ctrl }));
        break;
      case 'AltLeft':
        setModifiers((m) => ({ ...m, alt: !m.alt }));
        break;
      case 'AltRight':
        setModifiers((m) => ({ ...m, altGr: !m.altGr }));
        break;
    }
  }, []);

  // Virtual key click handler
  const handleVirtualKeyClick = useCallback((keyId: string) => {
    handleKey(keyId);
    setModifiers((m) => ({ ...m, shift: false, alt: false, ctrl: false, altGr: false }));
  }, [handleKey]);

  // Get display character for a key
  const getDisplayChar = useCallback((keyDef: KeyDef): string => {
    const effectiveShift = modifiers.shift || hoverShift;
    const effectiveCaps = modifiers.caps || hoverCaps;
    const effectiveAltGr = modifiers.altGr || hoverAltGr;
    const effectiveCtrl = modifiers.ctrl || (hoverAltCtrl ? true : false);
    const effectiveAlt = modifiers.alt || (hoverAltCtrl ? true : false);

    const state = getKeyState(
      effectiveCtrl, effectiveAlt, effectiveShift,
      effectiveCaps, keyDef.c || '0', effectiveAltGr
    );
    let char = (keyDef as unknown as Record<string, string>)[state] || '';

    if (modifiers.prev) {
      const mapped = getMappedDeadkeyValue(currentLayout.deadkeys, char, modifiers.prev);
      if (mapped) char = mapped;
    }

    return char || '\u00A0';
  }, [modifiers, currentLayout, hoverShift, hoverCaps, hoverAltCtrl, hoverAltGr]);

  // Undo/Redo
  const handleUndo = useCallback(() => {
    if (undoStack.current.length === 0) return;
    const prev = undoStack.current.pop()!;
    if (prev !== text) {
      redoStack.current.push(text);
      setText(prev);
    } else {
      redoStack.current.push(prev);
      setText(undoStack.current.length === 0 ? '' : undoStack.current[undoStack.current.length - 1]);
    }
    const stored = loadStoredState();
    stored.undo = undoStack.current;
    stored.redo = redoStack.current;
    saveStoredState(stored);
  }, [text]);

  const handleRedo = useCallback(() => {
    if (redoStack.current.length === 0) return;
    const next = redoStack.current.pop()!;
    setText(next);
    undoStack.current.push(next);
    const stored = loadStoredState();
    stored.undo = undoStack.current;
    stored.redo = redoStack.current;
    saveStoredState(stored);
  }, []);

  const handleClearAll = useCallback(() => {
    if (text.length >= 10 && !window.confirm('Are you sure you want to clear all the text?')) return;
    undoStack.current = [];
    redoStack.current = [];
    saveStoredState({ layout: selectedLayoutId, undo: [], redo: [], fontSize });
    setText('');
  }, [text, selectedLayoutId, fontSize]);

  const handleCopy = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.select();
    navigator.clipboard.writeText(ta.value).catch(() => {
      document.execCommand('copy');
    });
    ta.focus();
  }, []);

  const handleSelectAll = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.select();
    ta.focus();
  }, []);

  const handleShrink = useCallback(() => {
    setFontSize((s) => Math.max(12, s - 2));
  }, []);

  const handleEnlarge = useCallback(() => {
    setFontSize((s) => Math.min(36, s + 2));
  }, []);

  const renderKeyButton = (keyIndex: number) => {
    const keyId = `k${keyIndex}`;
    const keyDef = getKey(currentLayout.keys, keyId);
    if (!keyDef) return null;

    const refLegend = getKeyLegend(defaultLayoutData.keys, keyId);
    const displayChar = getDisplayChar(keyDef);
    const isShifted = modifiers.shift || hoverShift;

    return (
      <button
        key={keyId}
        className="vk-key"
        onClick={() => handleVirtualKeyClick(keyId)}
      >
        <div className="vk-label-ref">{refLegend}</div>
        <div
          className={isShifted ? 'vk-label-shift' : 'vk-label-natural'}
          style={{ fontSize: `${fontSize}px` }}
        >
          {displayChar}
        </div>
      </button>
    );
  };

  const renderEmojiPanel = () => {
    const cols = window.innerWidth < 640 ? 6 : 14;
    const totalKeys = cols * 5;
    const keys = [];
    for (let i = 0; i < totalKeys; i++) {
      const char = fromCharCodeSafe(emojiCodePoint + i);
      keys.push(
        <button
          key={`emoji-${i}`}
          className="vk-key"
          onClick={() => handleEmojiKey(i)}
        >
          <div style={{ fontSize: `${fontSize}px` }}>{char}</div>
        </button>
      );

      const row = Math.floor(i / cols);
      const col = (i % cols) + 1;
      if (col === cols) {
        if (row === 0) {
          keys.push(
            <button key="emoji-scrollup" className="vk-key" onClick={() => setEmojiCodePoint((p) => Math.max(0, p - 14))}>
              <div style={{ fontSize: `${fontSize}px` }}>⏶</div>
            </button>
          );
        } else if (row === 1) {
          keys.push(
            <button key="emoji-abc" className="vk-key" onClick={() => setShowEmoji(false)}>
              <span>abc</span>
            </button>
          );
        } else if (row === 2) {
          keys.push(
            <button key="emoji-back" className="vk-key" onClick={handleBackspace}>
              <div style={{ fontSize: `${fontSize}px` }}>⌫</div>
            </button>
          );
        } else if (row === 3) {
          keys.push(
            <button key="emoji-enter" className="vk-key" onClick={handleEnter}>
              <div style={{ fontSize: `${fontSize}px` }}>↵</div>
            </button>
          );
        } else if (row === 4) {
          keys.push(
            <button key="emoji-scrolldown" className="vk-key" onClick={() => setEmojiCodePoint((p) => p + 14)}>
              <div style={{ fontSize: `${fontSize}px` }}>⏷</div>
            </button>
          );
        }
        keys.push(<div key={`clear-${row}`} className="vk-clear" />);
      }
    }
    return <div className="vk-emoji-panel">{keys}</div>;
  };

  return (
    <div className="virtual-keyboard-container">
      {/* Layout selector */}
      <div className="vk-layout-selector">
        {layouts.map((layout) => (
          <label key={layout.id} className="vk-layout-option">
            <input
              type="radio"
              name="keyboard-layout"
              checked={selectedLayoutId === layout.id}
              onChange={() => setSelectedLayoutId(layout.id)}
            />
            {layout.name}
          </label>
        ))}
      </div>

      {/* Toolbar */}
      <div className="vk-toolbar">
        <button onClick={handleShrink} title="Decrease font size">A-</button>
        <button onClick={handleEnlarge} title="Increase font size">A+</button>
        <button onClick={handleSelectAll}>Select All</button>
        <button onClick={handleCopy}>Copy</button>
        <button onClick={handleUndo}>Undo</button>
        <button onClick={handleRedo}>Redo</button>
        <button onClick={handleClearAll}>Clear All</button>
      </div>

      {/* Text area */}
      <textarea
        ref={textareaRef}
        className="vk-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handlePhysicalKeyDown}
        onKeyUp={handlePhysicalKeyUp}
        style={{
          fontSize: `${fontSize}px`,
          direction: currentLayout.dir,
        }}
        rows={isMobile ? 4 : 6}
      />

      {/* Keyboard */}
      <div className="vk-keyboard">
        {showEmoji ? (
          renderEmojiPanel()
        ) : isMobile ? (
          /* ── Mobile compact layout ─────────────────────────────── */
          <div className="vk-alpha vk-mobile">
            {/* Letter rows */}
            <div className="vk-row">
              {MOB_ROW_1.map((i) => renderKeyButton(i))}
            </div>
            <div className="vk-row">
              {MOB_ROW_2.map((i) => renderKeyButton(i))}
            </div>
            <div className="vk-row">
              <button
                className={`vk-key vk-fn ${modifiers.shift ? 'vk-active' : ''}`}
                onClick={() => setModifiers((m) => ({ ...m, shift: !m.shift }))}
              >
                <span>⇧</span>
              </button>
              {MOB_ROW_3.map((i) => renderKeyButton(i))}
              <button className="vk-key vk-fn" onClick={handleBackspace}>
                <span>⌫</span>
              </button>
            </div>

            {/* Function row */}
            <div className="vk-row">
              <button
                className={`vk-key vk-fn ${modifiers.caps ? 'vk-active' : ''}`}
                onClick={() => setModifiers((m) => ({ ...m, caps: !m.caps }))}
              >
                <span>Caps</span>
              </button>
              <button
                className={`vk-key vk-fn ${!isVirtualActive ? 'vk-active' : ''}`}
                onClick={() => setIsVirtualActive((v) => !v)}
              >
                <span>Esc</span>
              </button>
              <button className="vk-key vk-space" onClick={handleSpace}>
                <span>Space</span>
              </button>
              <button className="vk-key vk-fn" onClick={() => setShowEmoji(true)}>
                <span>😀</span>
              </button>
              <button className="vk-key vk-fn" onClick={handleEnter}>
                <span>↵</span>
              </button>
            </div>

            {/* AltGr row */}
            <div className="vk-row">
              <button
                className={`vk-key vk-fn ${modifiers.altGr ? 'vk-active' : ''}`}
                onClick={() => setModifiers((m) => ({ ...m, altGr: !m.altGr }))}
              >
                <span>AltGr</span>
              </button>
              <button
                className="vk-key vk-fn"
                onClick={() => setShowExtraKeys((v) => !v)}
              >
                <span>{showExtraKeys ? 'ABC' : '123'}</span>
              </button>
            </div>

            {/* Collapsible extra keys (numbers + punctuation) */}
            {showExtraKeys && (
              <div className="vk-row vk-row-extra">
                {MOB_ROW_EXTRA.map((i) => renderKeyButton(i))}
              </div>
            )}
          </div>
        ) : (
          /* ── Desktop full layout ───────────────────────────────── */
          <div className="vk-alpha">
            {/* Row 1: Number row */}
            <div className="vk-row">
              {ROW_NUMBER.map((i) => renderKeyButton(i))}
              <button className="vk-key vk-wide" onClick={handleBackspace}>
                <span>Backspace</span>
              </button>
            </div>

            {/* Row 2: Top letter row */}
            <div className="vk-row">
              <button className="vk-key vk-wide" disabled><span>Tab</span></button>
              {ROW_TOP.map((i) => renderKeyButton(i))}
              {renderKeyButton(25)}
            </div>

            {/* Row 3: Home row */}
            <div className="vk-row">
              <button
                className={`vk-key vk-wide ${modifiers.caps || hoverCaps ? 'vk-active' : ''}`}
                onClick={() => setModifiers((m) => ({ ...m, caps: !m.caps }))}
                onMouseOver={() => setHoverCaps(true)}
                onMouseOut={() => setHoverCaps(false)}
              >
                <span>Caps Lock</span>
              </button>
              {ROW_HOME.map((i) => renderKeyButton(i))}
              <button className="vk-key vk-wide vk-enter" onClick={handleEnter}>
                <span>Enter</span>
              </button>
            </div>

            {/* Row 4: Bottom row */}
            <div className="vk-row">
              <button
                className={`vk-key vk-wide ${modifiers.shift || hoverShift ? 'vk-active' : ''}`}
                onClick={() => setModifiers((m) => ({ ...m, shift: !m.shift }))}
                onMouseOver={() => setHoverShift(true)}
                onMouseOut={() => setHoverShift(false)}
              >
                <span>Shift</span>
              </button>
              {ROW_BOTTOM_EXTRA.map((i) => renderKeyButton(i))}
              {ROW_BOTTOM.map((i) => renderKeyButton(i))}
              <button
                className={`vk-key vk-wide ${modifiers.shift || hoverShift ? 'vk-active' : ''}`}
                onClick={() => setModifiers((m) => ({ ...m, shift: !m.shift }))}
                onMouseOver={() => setHoverShift(true)}
                onMouseOut={() => setHoverShift(false)}
              >
                <span>Shift</span>
              </button>
            </div>

            {/* Row 5: Space row */}
            <div className="vk-row">
              <button
                className={`vk-key vk-mod ${modifiers.ctrl || hoverAltCtrl ? 'vk-active' : ''}`}
                onClick={() => {
                  setModifiers((m) => ({ ...m, alt: !m.alt, ctrl: !m.ctrl }));
                }}
                onMouseOver={() => setHoverAltCtrl(true)}
                onMouseOut={() => setHoverAltCtrl(false)}
              >
                <span>Ctrl</span>
              </button>
              <button className="vk-key vk-mod" onClick={() => setShowEmoji(true)}>
                <span>Emoji</span>
              </button>
              <button
                className={`vk-key vk-mod ${modifiers.alt || hoverAltCtrl ? 'vk-active' : ''}`}
                onClick={() => {
                  setModifiers((m) => ({ ...m, alt: !m.alt, ctrl: !m.ctrl }));
                }}
                onMouseOver={() => setHoverAltCtrl(true)}
                onMouseOut={() => setHoverAltCtrl(false)}
              >
                <span>Alt</span>
              </button>
              <button className="vk-key vk-space" onClick={handleSpace}>
                <span>Space</span>
              </button>
              <button
                className={`vk-key vk-mod ${modifiers.altGr || hoverAltGr ? 'vk-active' : ''}`}
                onClick={() => setModifiers((m) => ({ ...m, altGr: !m.altGr }))}
                onMouseOver={() => setHoverAltGr(true)}
                onMouseOut={() => setHoverAltGr(false)}
              >
                <span>AltGr</span>
              </button>
              <button
                className={`vk-key vk-mod ${!isVirtualActive ? 'vk-active' : ''}`}
                onClick={() => setIsVirtualActive((v) => !v)}
                title="Turn on/off keyboard input conversion"
              >
                <span>Esc</span>
              </button>
              <button
                className={`vk-key vk-mod ${modifiers.ctrl || hoverAltCtrl ? 'vk-active' : ''}`}
                onClick={() => {
                  setModifiers((m) => ({ ...m, alt: !m.alt, ctrl: !m.ctrl }));
                }}
                onMouseOver={() => setHoverAltCtrl(true)}
                onMouseOut={() => setHoverAltCtrl(false)}
              >
                <span>Ctrl</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
