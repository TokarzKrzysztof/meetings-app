import { ChipTypeMap, styled } from '@mui/material';
import {
  default as MuiAutocomplete,
  AutocompleteProps as MuiAutocompleteProps,
  autocompleteClasses,
} from '@mui/material/Autocomplete';
import { ForwardedRef } from 'react';
import { Box } from 'src/ui-components/Box';
import { CircularProgress } from 'src/ui-components/CircularProgress';
import { Popper } from 'src/ui-components/Popper';
import { typedForwardRef } from 'src/utils/types/forward-ref';

const StyledPopper = styled(Popper)({
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

export type AutocompleteProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
  ChipComponent extends React.ElementType = ChipTypeMap['defaultComponent']
> = Omit<
  MuiAutocompleteProps<T, Multiple, DisableClearable, FreeSolo, ChipComponent>,
  'options' | 'getOptionLabel' | 'ref'
> & {
  optionsAsync: T[] | undefined;
  getOptionLabel?: (option: T) => string;
};

const AutocompleteInner = <
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
  ChipComponent extends React.ElementType = ChipTypeMap['defaultComponent']
>(
  {
    optionsAsync,
    renderOption,
    getOptionLabel,
    ...props
  }: AutocompleteProps<T, Multiple, DisableClearable, FreeSolo, ChipComponent>,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const loadingOption = (
    <Box
      component='li'
      // this is the list item so it has to have unique key
      key='loading-option'
      className={autocompleteClasses.option}
      sx={{
        // improve CSS specifity
        '&&': {
          pointerEvents: 'none',
          display: 'flex',
          justifyContent: 'center',
        },
      }}
    >
      <CircularProgress size={25} />
    </Box>
  );

  return (
    <MuiAutocomplete
      options={optionsAsync ?? ['loadingDummyOption' as T]}
      renderOption={optionsAsync ? renderOption : () => loadingOption}
      // fix error with option label as undefined instead of null
      getOptionLabel={(opt) => (getOptionLabel && getOptionLabel(opt as T)) ?? ''}
      PopperComponent={StyledPopper}
      noOptionsText='Brak opcji'
      {...props}
    ></MuiAutocomplete>
  );
};

export const Autocomplete = typedForwardRef(AutocompleteInner);
