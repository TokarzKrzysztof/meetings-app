import { ChipTypeMap } from '@mui/material';
import {
  default as MuiAutocomplete,
  AutocompleteProps as MuiAutocompleteProps,
} from '@mui/material/Autocomplete';

export const Autocomplete = <
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
  ChipComponent extends React.ElementType = ChipTypeMap['defaultComponent']
>({
  ...props
}: MuiAutocompleteProps<
  T,
  Multiple,
  DisableClearable,
  FreeSolo,
  ChipComponent
>) => <MuiAutocomplete {...props}></MuiAutocomplete>;
