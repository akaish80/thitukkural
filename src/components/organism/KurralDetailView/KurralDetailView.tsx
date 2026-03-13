import React, { useState, useEffect } from 'react';

interface KurralDetailViewProps {
  kurralList: any[];
}

const KurralDetailView = ({ kurralList }: KurralDetailViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredList, setFilteredList] = useState(kurralList);
  const [selectedKurral, setSelectedKurral] = useState(kurralList[0] || null);

  useEffect(() => {
    const filtered = kurralList.filter((item) => {
      const term = searchTerm.toLowerCase();
      return (
        (item.Tamil && item.Tamil.toLowerCase().includes(term)) ||
        (item.Index && (item.Index + '').includes(term)) ||
        (item.MuVaUrai && item.MuVaUrai.toLowerCase().includes(term)) ||
        (item.SolomonPaapaiyaUrai && item.SolomonPaapaiyaUrai.toLowerCase().includes(term)) ||
        (item.KalaignarUrai && item.KalaignarUrai.toLowerCase().includes(term))
      );
    });
    setFilteredList(filtered);
    setSelectedKurral(filtered[0] || null);
  }, [searchTerm, kurralList]);

  const renderParaWithHTML = (value: string) => <p dangerouslySetInnerHTML={{ __html: value }} />;

  const renderPara = (title: string, value: string, classKey: string, idx?: number) => (
    <>
      <p className={classKey}>{idx ? `${title} - ${idx}` : `${title}`}</p>
      {value && renderParaWithHTML(value)}
    </>
  );

  return (
    <div className="kurralContainer">
      <input
        type="text"
        placeholder="Search Kurral by number, text, or commentary..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '10px', width: '100%' }}
      />
      {filteredList.length === 0 ? (
        <p>No Kurral found.</p>
      ) : (
        <div>
          <select
            style={{ marginBottom: '10px', width: '100%' }}
            value={selectedKurral?.Index || ''}
            onChange={(e) => {
              const idx = Number(e.target.value);
              setSelectedKurral(filteredList.find((item) => item.Index === idx));
            }}
          >
            {filteredList.map((item) => (
              <option key={item.Index} value={item.Index}>
                {item.Index} - {item.Tamil}
              </option>
            ))}
          </select>
          {selectedKurral && (
            <div>
              {selectedKurral.Tamil && renderPara('கறள', selectedKurral.Tamil, 'title', selectedKurral.Index)}
              {selectedKurral.MuVaUrai && renderPara('ம.வ உர', selectedKurral.MuVaUrai, 'urraiTitle')}
              {selectedKurral.SolomonPaapaiyaUrai && renderPara('சலமன பபபய உர', selectedKurral.SolomonPaapaiyaUrai, 'urraiTitle')}
              {selectedKurral.KalaignarUrai && renderPara('கலஞர உர', selectedKurral.KalaignarUrai, 'urraiTitle')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KurralDetailView;
