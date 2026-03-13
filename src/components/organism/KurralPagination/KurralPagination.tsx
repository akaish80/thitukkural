import React from 'react';

interface KurralPaginationProps {
  kurralList: any[];
  selectedKurral: number;
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const KurralPagination = ({ kurralList, selectedKurral, handleClick }: KurralPaginationProps) => {
  return kurralList.map((_item: any, index: number) => {
    return (
      <button
        key={index}
        onClick={handleClick}
        className={`${_item.Index === selectedKurral ? 'active' : ''}`}
        data-id={_item.Index}
      >
        {_item.Index}
      </button>
    );
  });
};

export default KurralPagination;
