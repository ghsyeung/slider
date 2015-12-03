import React from 'react';

const Track = ({className, included, offset, length, trackColor}) => {
  const style = {
    left: offset + '%',
    width: length + '%',
    visibility: included ? 'visible' : 'hidden',
    backgroundColor: trackColor,
  };
  return <div className={className} style={style} />;
};

export default Track;
