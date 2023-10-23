import { default as MuiSlide, SlideProps as MuiSlideProps } from '@mui/material/Slide';

export type SlideProps = {};

export const Slide = ({ ...props }: MuiSlideProps & SlideProps) => <MuiSlide {...props}></MuiSlide>;
