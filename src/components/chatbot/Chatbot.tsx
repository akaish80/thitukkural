import React, { useState, useEffect, useRef } from 'react';
import './chatbot.scss';

interface Message {
  from: string;
  text: any;
  ts: number;
}

function MessageComponent({ m }: { m: Message }) {
  // m.text may be a string or a structured object { type, items }
  const renderText = () => {
    if (!m.text) return null;
    if (typeof m.text === 'string') return <div className="cb-message-text">{m.text}</div>;
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
        <div className="cb-message-text">
          <a
            href={`/kurral/${it.id}`}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/kurral/${it.id}`;
            }}
          >
            Open Kurral #{it.id}
          </a>
        </div>
      );
    }
    // fallback: JSON stringify
    return <div className="cb-message-text">{JSON.stringify(m.text)}</div>;
  };

  return <div className={`cb-message ${m.from === 'user' ? 'user' : 'bot'}`}>{renderText()}</div>;
}

export default function Chatbot() {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
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
    if (from === 'bot') {
      let speak = '';
      if (typeof text === 'string') speak = text;
      else if (typeof text === 'object') {
        if (text.type === 'list' && Array.isArray(text.items)) {
          speak = text.items.map((it: any) => it.title).join(', ');
        } else if (text.type === 'kurral' && text.title) {
          speak = text.title;
        } else {
          speak = JSON.stringify(text);
        }
      }
      if (speak) speakText(speak);
    }
  }

  // Endpoint fallback search when chat service is unavailable
  async function searchByEndpoints(query: string) {
    const q = query.toLowerCase().trim();

    // Check for specific kurral ID
    const kurralMatch = q.match(/kurral[:#\s]*(\d+)/i) || q.match(/^(\d+)$/);
    if (kurralMatch) {
      const id = parseInt(kurralMatch[1]);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/kurral/${id}`);
      if (response.ok) {
        const kurral = await response.json();
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
      }
    }

    // Check for adikaram
    const adikaramMatch = q.match(/adikaram[:#\s]*(\d+)/i);
    if (adikaramMatch) {
      const num = parseInt(adikaramMatch[1]);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/adikaram/${num}`);
      if (response.ok) {
        return await response.json();
      }
    }

    // Check for paal
    const paalMatch = q.match(/paal[:#\s]*(\d+)/i);
    if (paalMatch) {
      const num = parseInt(paalMatch[1]);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/thirukkural?paalIndex=${num}`);
      if (response.ok) {
        const payload = await response.json();
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
      }
    }

    return { results: [] };
  }

  async function handleSend() {
    const q = input && input.trim();
    if (!q) return;
    pushMessage('user', q);
    setInput('');
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
          pushMessage('bot', {
            type: 'kurral',
            id: r.kurral,
            title: item ? item.line1 || item.Tamil || item.English : '',
          });
        } else if (r.adikaram) {
          pushMessage('bot', `Adikaram ${r.adikaram}: ${r.results?.length || 0} kurrals found`);
        } else if (Array.isArray(r.results)) {
          if (r.results.length === 0) pushMessage('bot', 'No matches found.');
          else {
            const items = r.results
              .slice(0, 6)
              .map((x: any) => ({
                id: x.Index || x.Kurral_id || x.kurral_id,
                title: x.line1 || x.Tamil || x.English,
              }));
            pushMessage('bot', { type: 'list', items });
          }
        } else {
          pushMessage('bot', JSON.stringify(r));
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
          pushMessage('bot', {
            type: 'kurral',
            id: r.kurral,
            title: item ? item.line1 || item.Tamil || item.English : '',
          });
        } else if (r.adikaram) {
          pushMessage('bot', `Adikaram ${r.adikaram}: ${r.results?.length || 0} kurrals found`);
        } else if (Array.isArray(r.results)) {
          if (r.results.length === 0) pushMessage('bot', 'No matches found in local data.');
          else {
            const items = r.results
              .slice(0, 6)
              .map((x: any) => ({
                id: x.Index || x.Kurral_id || x.kurral_id,
                title: x.line1 || x.Tamil || x.English,
              }));
            pushMessage('bot', { type: 'list', items });
          }
        } else if (r.paalInfo) {
          pushMessage('bot', `Paal ${r.paal}: ${r.paalInfo.Tamil} (${r.paalInfo.English})`);
        } else {
          pushMessage('bot', 'No matches found.');
        }
      } catch (error) {
        pushMessage('bot', 'Endpoint fallback is unavailable right now. Please try again later.');
      }
    }

    setLoading(false);
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
      <div className="chatbot-button" onClick={() => setOpen((s) => !s)} aria-label="Open chat">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
          <path
            fill="currentColor"
            d="M12 3C7 3 3.2 6.2 3.2 10.4c0 1.9.8 3.6 2.1 4.9V21l4.1-2.2c1.1.3 2.3.5 3.6.5 5 0 8.8-3.2 8.8-7.4S17 3 12 3z"
          ></path>
        </svg>
      </div>

      <div className="chatbot-panel" role="dialog" aria-hidden={!open}>
        <div className="cb-header">
          <strong>Thirukkural Chat</strong>
          <button className="cb-close" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>
        <div className="cb-list" ref={listRef}>
          {messages.map((m, i) => (
            <MessageComponent key={m.ts + '-' + i} m={m} />
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
            <button className="cb-send" onClick={handleSend} disabled={loading}>
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
