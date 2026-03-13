/* eslint-disable jsx-a11y/aria-role */
import React from 'react';
import { useDrag } from 'react-dnd';
import './DragAndDrop.scss';


export interface DragContainerProps {
  name: string;
  type: string;
  isDropped: boolean;
}


export const DragContainer: React.FC<DragContainerProps> = ({ name, type, isDropped }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type,
      item: { name },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [name, type],
  );

  let className = 'drag-container';
  if (isDragging) {
    className += ' dragging';
  }

  return (
    <div ref={drag as any} role="DragContainer" className={className}>
      {isDropped ? <s>{name}</s> : name}
    </div>
  );
};
