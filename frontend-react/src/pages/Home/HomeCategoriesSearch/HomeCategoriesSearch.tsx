import { styled } from '@mui/material/styles';
import { Autocomplete, Box, Icon, TextField } from 'src/ui-components';

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
  return (
    <>
      <StyledSearchFieldBox>
        <Autocomplete
          freeSolo
          options={top100Films}
          sx={{ width: '85%', backgroundColor: 'white', height: 47 }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder='Wyszukaj spośród 12 kategorii...'
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <Icon name='search' fontSize='small' sx={{ opacity: 0.5 }} />
                ),
                sx: { fontSize: 13, '::placeholder': { color: 'red' } },
              }}
            />
          )}
        />
      </StyledSearchFieldBox>
    </>
  );
};
