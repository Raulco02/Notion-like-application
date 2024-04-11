import React from 'react';

const ListComponent = ({ items, onItemClick, onMasClick }) => {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index} onClick={() => onItemClick(item)}>
          {item}
        </li>
      ))}
      <li key={'+'} onClick={() => onMasClick()}>+</li>
    </ul>
  );
};

export default ListComponent;