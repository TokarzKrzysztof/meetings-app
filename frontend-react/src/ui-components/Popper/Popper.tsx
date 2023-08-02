import {
  default as MuiPopper,
  PopperProps as MuiPopperProps,
} from '@mui/material/Popper';
import { styled } from '@mui/material/styles';

const StyledPopper = styled(MuiPopper)({
  '& .MuiPaper-root': {
    borderRadius: 12,
    marginTop: 5,
  },
  '& .MuiAutocomplete-listbox': {
    padding: 0,
  },
  '& .MuiAutocomplete-option': {
    fontSize: 13,
  },
});

export type PopperProps = {};

export const Popper = ({ ...props }: MuiPopperProps & PopperProps) => (
  <StyledPopper {...props}></StyledPopper>
);
