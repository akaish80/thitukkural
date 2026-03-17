export interface Message {
  from: string;
  text: any;
  ts: number;
}

function MessageComponent({ m }: { m: Message }) {
  const renderText = () => {
    if (!m.text) return null;
    if (typeof m.text === 'string') return <div className="cb-message-text">{m.text}</div>;
    if (typeof m.text === 'object' && m.text.type === 'list') {
      return (
        <div className="cb-message-text cb-list-result">
          {m.text.items.map((it: any, i: number) => (
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
    return <div className="cb-message-text">{JSON.stringify(m.text)}</div>;
  };
  return <div className={`cb-message cb-${m.from}`}>{renderText()}</div>;
}

export default MessageComponent;
