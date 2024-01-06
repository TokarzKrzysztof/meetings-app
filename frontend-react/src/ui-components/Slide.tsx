import { default as MuiSlide, SlideProps as MuiSlideProps } from '@mui/material/Slide';
import { ForwardedRef } from 'react';
import { typedForwardRef } from 'src/utils/types/forward-ref';

export type SlideProps = MuiSlideProps & {};

const SlideInner = ({ ...props }: SlideProps, ref: ForwardedRef<unknown>) => (
  <MuiSlide ref={ref} {...props}></MuiSlide>
);

export const Slide = typedForwardRef(SlideInner);
