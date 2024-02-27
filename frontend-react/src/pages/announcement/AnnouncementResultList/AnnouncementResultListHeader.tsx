import { useState } from 'react';
import { Header } from 'src/components/header/Header';
import { AnnouncementResultListHeaderFilters } from 'src/pages/announcement/AnnouncementResultList/AnnouncementResultListHeaderFilters';
import { useGetCurrentUser } from 'src/queries/user-queries';
import { Button, MenuItem, TextField, Toolbar } from 'src/ui-components';
import {
    ResultListQueryParams,
    SortOption,
} from 'src/utils/announcement-result-list-utils';

export type AnnouncementResultListHeaderProps = {
  params: ResultListQueryParams;
  onUpdateQueryParams: (params: ResultListQueryParams) => void;
};

export const AnnouncementResultListHeader = ({
  params,
  onUpdateQueryParams,
}: AnnouncementResultListHeaderProps) => {
  const { currentUser } = useGetCurrentUser();
  const [showFiltersDialog, setShowFiltersDialog] = useState(false);

  return (
    <>
      <Header
        secondToolbar={
          <Toolbar
            sx={{ justifyContent: 'space-between', backgroundColor: 'white', minHeight: 65, gap: 1 }}
          >
            <TextField
              select
              label='Sortowanie'
              size='small'
              value={params.sortBy}
              SelectProps={{
                onChange: (e) =>
                  onUpdateQueryParams({ ...params, sortBy: e.target.value as SortOption }),
              }}
            >
              <MenuItem value={SortOption.Newest}>Od najnowszych</MenuItem>
              <MenuItem value={SortOption.Oldest}>Od najstarszych</MenuItem>
              {/* cannot use fragment here */}
              {currentUser && (
                <MenuItem value={SortOption.DistanceMin}>Odległość: od najmniejszej</MenuItem>
              )}
              {currentUser && (
                <MenuItem value={SortOption.DistanceMax}>Odległość: od największej</MenuItem>
              )}
            </TextField>
            <Button size='small' onClick={() => setShowFiltersDialog(true)}>
              Filtruj
            </Button>
          </Toolbar>
        }
      />
      {/* this needs to be like this for hiding animation to work */}
      <AnnouncementResultListHeaderFilters
        params={params}
        onSubmit={(params) => {
          onUpdateQueryParams(params);
          setShowFiltersDialog(false);
        }}
        open={showFiltersDialog}
        onClose={() => setShowFiltersDialog(false)}
      />
    </>
  );
};
