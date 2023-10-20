import {
  default as MuiSlider,
  SliderProps as MuiSliderProps,
  SliderTypeMap,
} from '@mui/material/Slider';

export type SliderProps<
  D extends React.ElementType = SliderTypeMap['defaultComponent']
> = MuiSliderProps<D, { component?: D }> & {};

export const Slider = <
  D extends React.ElementType = SliderTypeMap['defaultComponent']
>({
  ...props
}: SliderProps<D>) => <MuiSlider {...props}></MuiSlider>;
