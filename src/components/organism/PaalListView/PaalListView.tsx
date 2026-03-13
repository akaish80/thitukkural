import React, { useState } from 'react';
import ListGroup from '../../ListGroup';

interface PaalListDataViewProps {
  data: any[];
  selectedId: number;
  handleListClick: (id: number) => void;
}

const PaalListDataView = ({ data, selectedId, handleListClick }: PaalListDataViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  React.useEffect(() => {
    setFilteredData(
      data.filter(
        (item) =>
          item.Tamil.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.Index + '').includes(searchTerm)
      )
    );
  }, [searchTerm, data]);

  const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
    const id = Number(e.currentTarget.getAttribute('data-id'));
    handleListClick(id);
  };

  return (
    <div className="palVagaiContainer">
      <input
        type="text"
        placeholder="Search Paal..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '10px', width: '100%' }}
      />
      <ListGroup
        listData={filteredData}
        className="palVagaiList"
        selectedId={selectedId}
        handleButtonClick={handleClick}
      />
    </div>
  );
};
export default PaalListDataView;
