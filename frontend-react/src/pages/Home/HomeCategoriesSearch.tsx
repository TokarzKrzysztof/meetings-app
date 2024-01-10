import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Category } from 'src/models/category';
import { Autocomplete, Box, Button, Icon, TextField } from 'src/ui-components';
import { getDefaultAnnouncementResultListParams } from 'src/utils/announcement-filters-utils';
import { AppRoutes } from 'src/utils/enums/app-routes';

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

export type HomeCategoriesSearchProps = {
  data: Category[] | undefined;
};

export const HomeCategoriesSearch = ({ data }: HomeCategoriesSearchProps) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  return (
    <>
      <StyledSearchFieldBox>
        <StyledAutocomplete
          freeSolo
          optionsAsync={data}
          getOptionLabel={(opt) => opt.name}
          onChange={(_, value) => setSelectedCategory(value as Category)}
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
      <Box display='flex' justifyContent='center' mt={6}>
        <Button
          disabled={!selectedCategory}
          size='large'
          endIcon={<Icon name='arrow_forward' />}
          component={Link}
          to={AppRoutes.AnnouncementResultList(
            getDefaultAnnouncementResultListParams(selectedCategory?.id as string)
          )}
        >
          Sprawdź
        </Button>
      </Box>
    </>
  );
};
