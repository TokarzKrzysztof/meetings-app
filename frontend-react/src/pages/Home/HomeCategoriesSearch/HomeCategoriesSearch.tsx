import { styled } from '@mui/material/styles';
import { useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Icon,
  Popper,
  TextField,
} from 'src/ui-components';

const StyledSearchFieldBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 90,
  margin: '0 auto',
  backgroundColor: 'rgb(250, 250, 250)',
  borderRadius: 15,
  boxShadow: '0px 0px 20px 0px rgba(231, 208, 208, 1)',
  maxWidth: 500,
});

const StyledAutocomplete = styled(Autocomplete)({
  width: '85%',
  backgroundColor: 'white',
  '& .MuiIcon-root': {
    marginTop: 2,
    marginRight: 2,
    opacity: 0.5,
  },
  '& .MuiInputBase-root': {
    padding: 7,
  },
  '& .MuiInputBase-input': {
    fontSize: 13,
    '&::placeholder': { color: 'black', opacity: 0.6 },
  },
}) as typeof Autocomplete;

const top100Films = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 },
];

export type HomeCategoriesSearchProps = {};

export const HomeCategoriesSearch = ({
  ...props
}: HomeCategoriesSearchProps) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  return (
    <>
      <StyledSearchFieldBox>
        <StyledAutocomplete
          freeSolo
          options={top100Films}
          PopperComponent={Popper}
          onChange={(_, value) => setIsButtonDisabled(!value)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder='Wyszukaj spośród 12 kategorii...'
              InputProps={{
                ...params.InputProps,
                startAdornment: <Icon name='search' fontSize='small' />,
              }}
            />
          )}
        />
      </StyledSearchFieldBox>
      <Box display={'flex'} justifyContent={'center'} mt={6}>
        <Button
          disabled={isButtonDisabled}
          size='large'
          endIcon={<Icon name='arrow_forward' />}
        >
          Sprawdź
        </Button>
      </Box>
    </>
  );
};
