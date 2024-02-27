import { useSetAtom } from 'jotai';
import { useRef, useState } from 'react';
import { LoginRequiredDialog } from 'src/components/LoginRequiredDialog';
import { UserGender } from 'src/models/user';
import { confirmationDialogAtom } from 'src/providers/ConfirmationDialogProvider/ConfirmationDialogProvider';
import {
  useAddObservedSearch,
  useRemoveObservedSearch,
  useTryGetObservedSearchByFilters,
} from 'src/queries/observed-search-queries';
import { useGetCurrentUser } from 'src/queries/user-queries';
import { Button, Checkbox, DialogContentText, FormControlLabel, Icon } from 'src/ui-components';
import { ResultListQueryParams } from 'src/utils/announcement-result-list-utils';

export type AnnouncementResultListObserveSearchProps = {
  params: ResultListQueryParams;
};

export const AnnouncementResultListObserveSearch = ({
  params,
}: AnnouncementResultListObserveSearchProps) => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { currentUser, currentUserFetching } = useGetCurrentUser();
  const {
    observedSearchByFilters,
    observedSearchByFiltersFetching,
    observedSearchByFiltersRefetch,
  } = useTryGetObservedSearchByFilters(params, {
    enabled: !!currentUser,
  });
  const { addObservedSearch, addObservedSearchInProgress } = useAddObservedSearch();
  const { removeObservedSearch, removeObservedSearchInProgress } = useRemoveObservedSearch();
  const confirm = useSetAtom(confirmationDialogAtom);
  const isEmailNotificationEnabledRef = useRef(true);

  const handleAddObservedSearch = () => {
    confirm({
      message: (
        <DialogContentText component={'div'}>
          Czy chcesz obserwować to wyszukiwanie? <br />
          Będziesz {currentUser!.gender === UserGender.Male ? 'mógł' : 'mogła'} nimi zarządzać w
          zakładce <b>Obserwowane</b>.
          <FormControlLabel
            sx={{ mt: 2 }}
            label={'Chcę także otrzymywać powiadomienia e-mail'}
            control={
              <Checkbox
                defaultChecked={isEmailNotificationEnabledRef.current}
                onChange={(e) => (isEmailNotificationEnabledRef.current = e.target.checked)}
                size='small'
              />
            }
          />
        </DialogContentText>
      ),
      onAccept: () => {
        return addObservedSearch(
          {
            ...params,
            isEmailNotificationEnabled: isEmailNotificationEnabledRef.current,
            resultListUrl: window.location.href,
          },
          {
            onSuccess: () => observedSearchByFiltersRefetch(),
          }
        );
      },
    });
  };

  const handleRemoveObservedSearch = () => {
    removeObservedSearch(observedSearchByFilters!.id, {
      onSuccess: () => observedSearchByFiltersRefetch(),
    });
  };

  const isButtonDisabled =
    currentUserFetching ||
    observedSearchByFiltersFetching ||
    addObservedSearchInProgress ||
    removeObservedSearchInProgress;

  return (
    <>
      {observedSearchByFilters ? (
        <Button
          startIcon={<Icon name='visibility_off' />}
          size='small'
          variant='text'
          onClick={handleRemoveObservedSearch}
          disabled={isButtonDisabled}
        >
          Przestań obserwować wyszukiwanie
        </Button>
      ) : (
        <Button
          startIcon={<Icon name='visibility' />}
          size='small'
          variant='text'
          onClick={currentUser ? handleAddObservedSearch : () => setShowLoginPrompt(true)}
          disabled={isButtonDisabled}
        >
          Obserwuj wyszukiwanie
        </Button>
      )}
      {showLoginPrompt && (
        <LoginRequiredDialog
          text='Musisz być zalogowany/a żeby obserwować wyszukiwania'
          loginRedirectUrl={''}
          onClose={() => setShowLoginPrompt(false)}
        />
      )}
    </>
  );
};
