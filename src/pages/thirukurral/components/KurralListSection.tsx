import React from 'react';
import { KurralData } from 'types';
// import { Kurral } from '../thirukurral.component';

interface KurralListSectionProps {
  kurralDataList: KurralData[];
  selectedKurral: KurralData | null;
  handleOnClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
}

const KurralListSection: React.FC<KurralListSectionProps> = ({
  kurralDataList,
  selectedKurral,
  handleOnClick,
  children,
}) => (
  <div className="section kurral-section">
    <h2 className="section-title">குறள்கள்</h2>
    <div className="section-content kurral-buttons">
      {kurralDataList.map((_item, index) => (
        <button
          key={index}
          onClick={handleOnClick}
          className={`kurral-btn${_item.isClicked ? ' active' : ''}`}
        >
          {_item.Index}
        </button>
      ))}
    </div>
    {children}
  </div>
);

export default KurralListSection;
