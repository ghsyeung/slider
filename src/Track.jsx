import React from 'react';

const Track = ({fromMid, className, included, offset, length, trackColor}) => {
  const style = {
    left: offset + '%',
    width: length + '%',
    visibility: included ? 'visible' : 'hidden',
    backgroundColor: trackColor,
  };

  if (fromMid) {
    style.left = ((length > 50) ? 50 : length) + "%",
    style.width = ((length > 50) ? length - 50 : 50 - length) + "%"
    if (length < 50) {
      style.borderTopRightRadius = style.borderBottomRightRadius = 0;
    } else {
      style.borderTopLeftRadius = style.borderBottomLeftRadius = 0;
    }
  }
  return <div className={className} style={style} />;
};

export default Track;
