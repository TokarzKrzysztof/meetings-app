import { CSSProperties } from 'react';

export const limitLinesVertical = (nrOfLines: number) => {
  return {
    display: '-webkit-box',
    WebkitLineClamp: nrOfLines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    whiteSpace: 'pre-wrap',
    padding: 0
  } as CSSProperties;
};
