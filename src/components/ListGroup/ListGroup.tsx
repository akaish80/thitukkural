import React from 'react';
import './ListGroup.styles.scss';

interface ListGroupProps {
  listData: any[];
  className?: string;
  handleButtonClick?: (e: React.MouseEvent<HTMLLIElement>) => void;
  selectedId?: number;
}

const ListGroup = (props: ListGroupProps) => {
  const { listData, className, handleButtonClick, selectedId } = props;
  return (
    <ul className={`itemList ${className}`}>
      {listData.map((data: any) => (
        <li
          key={data.Index}
          className={`itemData ${data.Index === selectedId ? 'active' : ''}`}
          onClick={handleButtonClick}
          data-id={data.Index}
        >
          {data.Tamil}
          {/* <button /> */}
        </li>
      ))}
    </ul>
  );
};

ListGroup.defaultProps = {
  listData: [],
  className: '',
  handleButtonClick: () => {},
  selectedId: -1,
};
export default ListGroup;
