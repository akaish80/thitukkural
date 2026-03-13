/* eslint-disable jsx-a11y/aria-role */
import React from 'react';
import { useDrop } from 'react-dnd';
import './DragAndDrop.scss';


export interface DropContainerProps {
  name: string;
  accept: string | string[];
  onDrop: (item: { name: string }) => void;
}


export const DropContainer: React.FC<DropContainerProps> = ({ name, accept, onDrop }) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept,
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = canDrop && isOver;

  let className = 'drop-container';
  if (isActive) {
    className += ' is-active';
  } else if (canDrop) {
    className += ' can-drop';
  }

  return (
    <div ref={drop as any} role="DropContainer" className={className}>
      {isActive ? 'Release to drop' : name}
    </div>
  );
};
