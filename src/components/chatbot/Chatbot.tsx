import React, { useState, useEffect, useRef, useMemo } from 'react';
import './chatbot.scss';
import fetchWrapper from '../../utils/fetchWrapper';

interface Message {
  from: string;
  text: any;
  ts: number;
}

function renderInlineMarkdown(text: string) {
  const tokenRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^\)]+\))/g;
  const parts = text.split(tokenRegex).filter(Boolean);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={idx}>{part.slice(1, -1)}</em>;
    }

    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={idx}>{part.slice(1, -1)}</code>;
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      return (
        <a key={idx} href={href} target="_blank" rel="noreferrer">
          {label}
        </a>
      );
    }

    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

function renderMarkdown(text: string) {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];
  let unorderedItems: string[] = [];
  let orderedItems: string[] = [];

  const flushUnorderedList = () => {
    if (!unorderedItems.length) return;
    nodes.push(
      <ul key={`ul-${nodes.length}`}>
        {unorderedItems.map((item, i) => (
          <li key={i}>{renderInlineMarkdown(item)}</li>
        ))}
      </ul>,
    );
    unorderedItems = [];
  };

  const flushOrderedList = () => {
    if (!orderedItems.length) return;
    nodes.push(
      <ol key={`ol-${nodes.length}`}>
        {orderedItems.map((item, i) => (
          <li key={i}>{renderInlineMarkdown(item)}</li>
        ))}
      </ol>,
    );
    orderedItems = [];
  };

  const flushLists = () => {
    flushUnorderedList();
    flushOrderedList();
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      flushOrderedList();
      unorderedItems.push(trimmed.slice(2));
      return;
    }

    const orderedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (orderedMatch) {
      flushUnorderedList();
      orderedItems.push(orderedMatch[1]);
      return;
    }

    if (trimmed.startsWith('### ')) {
      flushLists();
      nodes.push(<h3 key={`h3-${nodes.length}`}>{renderInlineMarkdown(trimmed.slice(4))}</h3>);
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushLists();
      nodes.push(<h2 key={`h2-${nodes.length}`}>{renderInlineMarkdown(trimmed.slice(3))}</h2>);
      return;
    }

    if (trimmed.startsWith('# ')) {
      flushLists();
      nodes.push(<h1 key={`h1-${nodes.length}`}>{renderInlineMarkdown(trimmed.slice(2))}</h1>);
      return;
    }

    flushLists();
    nodes.push(
      <p key={`p-${nodes.length}`}>{trimmed ? renderInlineMarkdown(trimmed) : <br />}</p>,
    );
  });

  flushLists();
  return nodes;
}

const STARTER_PROMPTS = [
  'kurral:10',
  'adikaram:3',
  'paal:1',
  'show kurral about rain',
];

function getQuickReplies(text: any): string[] {
  if (typeof text === 'string') {
    return ['Show more like this', 'Explain simply', 'Tamil only'];
  }

  if (text?.type === 'kurral' && text?.id) {
    return [
      `kurral:${text.id + 1}`,
      `kurral:${Math.max(1, text.id - 1)}`,
      `adikaram:${text.adikaram || 1}`,
    ];
  }

  if (text?.type === 'list' && Array.isArray(text.items) && text.items.length > 0) {
    return [
      `kurral:${text.items[0].id}`,
      'Show related kurral',
      'Explain first result',
    ];
  }

  return STARTER_PROMPTS;
}

function messageToPlainText(text: any): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  if (text?.type === 'kurral') {
    return [`Kurral #${text.id}`, text.title || '', text.line2 || ''].filter(Boolean).join('\n');
  }
  if (text?.type === 'list' && Array.isArray(text.items)) {
    return text.items.map((it: any) => `#${it.id} ${it.title || ''}`.trim()).join('\n');
  }
  return JSON.stringify(text);
}

function buildSimpleExplanation(text: any): string {
  if (!text) return 'I could not find enough details to simplify this.';

  if (typeof text === 'string') {
    return `Simple meaning: ${text}`;
  }

  if (text?.type === 'kurral') {
    const lines = [text.title, text.line2].filter(Boolean).join(' ');
    const englishMeaning = text.englishMeaning || text.english || '';
    if (englishMeaning) {
      return [
        `## Simple meaning for Kurral #${text.id}`,
        '',
        `- **Tamil summary:** ${lines || 'This kurral gives a practical life lesson.'}`,
        `- **English meaning:** ${englishMeaning}`,
      ].join('\n');
    }
    return [
      `## Simple meaning for Kurral #${text.id}`,
      '',
      `- **Tamil summary:** ${lines || 'This kurral gives a practical life lesson.'}`,
    ].join('\n');
  }

  if (text?.type === 'list' && Array.isArray(text.items)) {
    const first = text.items[0];
    if (first) {
      return `Simple summary: Start with Kurral #${first.id}. It is likely the closest match to your question.`;
    }
    return 'Simple summary: No matching kurrals were found.';
  }

  return `Simple meaning: ${messageToPlainText(text)}`;
}

function MessageComponent({
  m,
  isLatestBot,
  onCopy,
  onExplain,
  onRegenerate,
}: {
  m: Message;
  isLatestBot: boolean;
  onCopy: (m: Message) => void;
  onExplain: (m: Message) => void;
  onRegenerate: () => void;
}) {
  // m.text may be a string or a structured object { type, items }
  const renderedMarkdown = useMemo(
    () => (typeof m.text === 'string' ? renderMarkdown(m.text) : null),
    [m.text],
  );

  const renderText = () => {
    if (!m.text) return null;
    if (typeof m.text === 'string') {
      return <div className="cb-message-text cb-markdown">{renderedMarkdown}</div>;
    }
    if (typeof m.text === 'object' && m.text.type === 'list') {
      return (
        <div className="cb-message-text cb-list-result">
          {m.text.items.map((it: any, i: number) => (
            // navigate to the kurral page when clicked
            <div key={i} className="cb-list-item">
              <a
                href={`/kurral/${it.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `/kurral/${it.id}`;
                }}
              >
                #{it.id} — {it.title}
              </a>
            </div>
          ))}
        </div>
      );
    }
    if (typeof m.text === 'object' && m.text.type === 'kurral') {
      const it = m.text;
      return (
        <div className="cb-message-text cb-kurral-card">
          <div className="cb-kurral-id">Kurral #{it.id}</div>
          {it.title && <div className="cb-kurral-line">{it.title}</div>}
          {it.line2 && <div className="cb-kurral-line">{it.line2}</div>}
          <a
            className="cb-kurral-link"
            href={`/kurral/${it.id}`}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/kurral/${it.id}`;
            }}
          >
            Open details
          </a>
        </div>
      );
    }
    // fallback: JSON stringify
    return <div className="cb-message-text">{JSON.stringify(m.text)}</div>;
  };

  return (
    <div className={`cb-message ${m.from === 'user' ? 'user' : 'bot'} ${isLatestBot ? 'latest-bot' : ''}`}>
      {renderText()}
      {m.from === 'bot' && (
        <div className="cb-inline-actions">
          <button type="button" onClick={() => onCopy(m)}>
            Copy
          </button>
          <button type="button" onClick={() => onExplain(m)}>
            Explain Simply
          </button>
          {isLatestBot && (
            <button type="button" onClick={onRegenerate}>
              Regenerate
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Chatbot() {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>(STARTER_PROMPTS);
  const [lastUserQuery, setLastUserQuery] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  function speakText(text: string) {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = 'ta-IN'; // Tamil
      window.speechSynthesis.speak(utter);
    }
  }

  function pushMessage(from: string, text: any) {
    setMessages((m) => [...m, { from, text, ts: Date.now() }]);
  }

  async function pushBotMessage(text: any) {
    setQuickReplies(getQuickReplies(text));

    if (typeof text === 'string' && text.trim()) {
      // Preserve whitespace/newlines while streaming so markdown formatting remains intact
      const chunks = text.match(/\s+|\S+/g) || [text];
      const ts = Date.now() + Math.floor(Math.random() * 1000);
      setMessages((m) => [...m, { from: 'bot', text: '', ts }]);

      for (let i = 0; i < chunks.length; i += 1) {
        const current = chunks.slice(0, i + 1).join('');
        setMessages((m) => m.map((it) => (it.ts === ts ? { ...it, text: current } : it)));
        await new Promise((resolve) => setTimeout(resolve, i < 20 ? 20 : 14));
      }
      speakText(text);
      return;
    }

    pushMessage('bot', text);
    const speak = messageToPlainText(text);
    if (speak) speakText(speak);
  }

  function copyMessage(m: Message) {
    const text = messageToPlainText(m.text);
    if (!text) return;
    if (navigator?.clipboard?.writeText) {
      void navigator.clipboard.writeText(text);
    }
  }

  function explainMessage(m: Message) {
    if (loading) return;
    const simplified = buildSimpleExplanation(m.text);
    void pushBotMessage(simplified);
  }

  function getLatestBotTs() {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i].from === 'bot') return messages[i].ts;
    }
    return -1;
  }

  // Endpoint fallback search when chat service is unavailable
  async function searchByEndpoints(query: string) {
    const q = query.toLowerCase().trim();

    // Check for specific kurral ID
    const kurralMatch = q.match(/kurral[:#\s]*(\d+)/i) || q.match(/^(\d+)$/);
    if (kurralMatch) {
      const id = parseInt(kurralMatch[1]);
      try {
        const kurral = await fetchWrapper(`${import.meta.env.VITE_API_BASE_URL}/api/kurral/${id}`);
        return {
          kurral: id,
          results: [
            {
              Kurral_id: kurral.Kurral_id || kurral.Index || id,
              Index: kurral.Index || kurral.Kurral_id || id,
              adikaram_number: kurral.adikaram_number,
              Tamil: kurral.Tamil || kurral.line1 || '',
              line1: kurral.line1 || kurral.Tamil || '',
              line2: kurral.line2 || '',
              English: kurral.English || '',
              EnglishMeaning: kurral.EnglishMeaning || '',
              Transliteration: kurral.Transliteration || '',
            },
          ],
        };
      } catch {
        // not found or error, fall through
      }
    }

    // Check for adikaram
    const adikaramMatch = q.match(/adikaram[:#\s]*(\d+)/i);
    if (adikaramMatch) {
      const num = parseInt(adikaramMatch[1]);
      try {
        return await fetchWrapper(`${import.meta.env.VITE_API_BASE_URL}/api/adikaram/${num}`);
      } catch {
        // not found or error, fall through
      }
    }

    // Check for paal
    const paalMatch = q.match(/paal[:#\s]*(\d+)/i);
    if (paalMatch) {
      const num = parseInt(paalMatch[1]);
      try {
        const payload = await fetchWrapper(`${import.meta.env.VITE_API_BASE_URL}/api/thirukkural?paalIndex=${num}`);
        return {
          paal: num,
          paalInfo: {
            paal_number: payload.paal?.index,
            Tamil: payload.paal?.tamil,
            English: payload.paal?.english,
            Transliteration: '',
          },
          results: payload.data || [],
        };
      } catch {
        // not found or error, fall through
      }
    }

    return { results: [] };
  }

  async function handleSend(queryOverride?: string, shouldPushUser = true) {
    const q = (queryOverride ?? input)?.trim();
    if (!q) return;

    if (shouldPushUser) {
      pushMessage('user', q);
      setInput('');
    }

    setLastUserQuery(q);
    setLoading(true);
    let shouldUseLocalData = false;

    try {
      const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, topN: 6 }),
      });
      if (!resp.ok) {
        // Service error - use local fallback
        shouldUseLocalData = true;
      } else {
        const json = await resp.json();
        // Build a friendly summary
        const r = json.result || json;
        if (r.kurral) {
          const item = (r.results && r.results[0]) || null;
          await pushBotMessage({
            type: 'kurral',
            id: r.kurral,
            adikaram: item?.adikaram_number,
            title: item ? item.line1 || item.Tamil || item.English : '',
            line2: item ? item.line2 || '' : '',
            englishMeaning: item ? item.EnglishMeaning || item.English || '' : '',
          });
        } else if (r.adikaram) {
          await pushBotMessage(`Adikaram ${r.adikaram}: ${r.results?.length || 0} kurrals found`);
        } else if (Array.isArray(r.results)) {
          if (r.results.length === 0) await pushBotMessage('No matches found.');
          else {
            const items = r.results
              .slice(0, 6)
              .map((x: any) => ({
                id: x.Index || x.Kurral_id || x.kurral_id,
                title: x.line1 || x.Tamil || x.English,
              }));
            await pushBotMessage({ type: 'list', items });
          }
        } else {
          await pushBotMessage(JSON.stringify(r));
        }
      }
    } catch (err: any) {
      // Network error - use local fallback
      shouldUseLocalData = true;
    }

    // Use endpoint fallback when chat service is unavailable
    if (shouldUseLocalData) {
      try {
        const localResult = await searchByEndpoints(q);
        const r = localResult;

        if (r.kurral) {
          const item = (r.results && r.results[0]) || null;
          await pushBotMessage({
            type: 'kurral',
            id: r.kurral,
            adikaram: item?.adikaram_number,
            title: item ? item.line1 || item.Tamil || item.English : '',
            line2: item ? item.line2 || '' : '',
            englishMeaning: item ? item.EnglishMeaning || item.English || '' : '',
          });
        } else if (r.adikaram) {
          await pushBotMessage(`Adikaram ${r.adikaram}: ${r.results?.length || 0} kurrals found`);
        } else if (Array.isArray(r.results)) {
          if (r.results.length === 0) await pushBotMessage('No matches found in local data.');
          else {
            const items = r.results
              .slice(0, 6)
              .map((x: any) => ({
                id: x.Index || x.Kurral_id || x.kurral_id,
                title: x.line1 || x.Tamil || x.English,
              }));
            await pushBotMessage({ type: 'list', items });
          }
        } else if (r.paalInfo) {
          await pushBotMessage(`Paal ${r.paal}: ${r.paalInfo.Tamil} (${r.paalInfo.English})`);
        } else {
          await pushBotMessage('No matches found.');
        }
      } catch (error) {
        await pushBotMessage('Endpoint fallback is unavailable right now. Please try again later.');
      }
    }

    setLoading(false);
  }

  function onQuickReplyClick(prompt: string) {
    const immediateIntentPattern = /^(kurral|adikaram|paal)\s*:\s*\d+$/i;
    if (!loading && immediateIntentPattern.test(prompt.trim())) {
      void handleSend(prompt, true);
      return;
    }

    setInput(prompt);
    setTimeout(() => {
      const textarea = document.querySelector('.cb-input textarea') as HTMLTextAreaElement | null;
      if (textarea) textarea.focus();
    }, 0);
  }

  function regenerateLastAnswer() {
    if (!lastUserQuery || loading) return;
    void handleSend(lastUserQuery, false);
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Voice input setup
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'ta-IN'; // Tamil
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + (prev ? ' ' : '') + transcript);
      setListening(false);
    };
    recognitionRef.current.onend = () => setListening(false);
    recognitionRef.current.onerror = () => setListening(false);
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  return (
    <div className={`chatbot-root ${open ? 'open' : 'closed'}`}>
      {!open && (<div className="chatbot-button" onClick={() => setOpen((s) => !s)} aria-label="Open chat">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
          <path
            fill="currentColor"
            d="M12 3C7 3 3.2 6.2 3.2 10.4c0 1.9.8 3.6 2.1 4.9V21l4.1-2.2c1.1.3 2.3.5 3.6.5 5 0 8.8-3.2 8.8-7.4S17 3 12 3z"
          ></path>
        </svg>
      </div>)}

      <div className="chatbot-panel" role="dialog" aria-hidden={!open}>
        <div className="cb-header">
          <strong>Thirukkural Chat</strong>
          <button className="cb-close" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>
        <div className="cb-list" ref={listRef}>
          {(() => {
            const latestBotTs = getLatestBotTs();
            return messages.map((m, i) => (
              <MessageComponent
                key={m.ts + '-' + i}
                m={m}
                isLatestBot={m.from === 'bot' && m.ts === latestBotTs}
                onCopy={copyMessage}
                onExplain={explainMessage}
                onRegenerate={regenerateLastAnswer}
              />
            ));
          })()}
          {loading && (
            <div className="cb-message bot">
              <div className="cb-message-text cb-typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>
        <div className="cb-quick-replies" aria-label="Quick replies">
          {quickReplies.map((reply) => (
            <button key={reply} type="button" className="cb-chip" onClick={() => onQuickReplyClick(reply)}>
              {reply}
            </button>
          ))}
        </div>
        <div className="cb-input">
          <textarea
            placeholder="Ask e.g. 'kurral:10' or 'adikaram:3' or 'virtue of rain'"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={2}
          />
          <div className="cb-actions">
            <button className="cb-send" onClick={() => void handleSend()} disabled={loading}>
              {loading ? '...' : 'Send'}
            </button>
            <button className="cb-mic" onClick={startListening} disabled={listening} title="Voice input">
              {listening ? '🎤...' : '🎤'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
