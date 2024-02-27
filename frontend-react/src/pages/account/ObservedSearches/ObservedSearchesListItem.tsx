import { useSetAtom } from 'jotai';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ObservedSearch } from 'src/models/observed-search';
import { UserGender } from 'src/models/user';
import { confirmationDialogAtom } from 'src/providers/ConfirmationDialogProvider/ConfirmationDialogProvider';
import {
  useRemoveObservedSearch,
  useToggleEmailNotification,
} from 'src/queries/observed-search-queries';
import {
  Box,
  Checkbox,
  DialogContentText,
  FormControlLabel,
  Icon,
  IconButton,
  ListItemButton,
  ListItemText,
  Typography,
} from 'src/ui-components';
import { experienceLevelOptions } from 'src/utils/announcement-utils';
import { withNoPropagation } from 'src/utils/dom-utils';

export type ObservedSearchesListItemProps = {
  item: ObservedSearch;
  onReload: () => void;
};

export const ObservedSearchesListItem = ({ item, onReload }: ObservedSearchesListItemProps) => {
  const confirm = useSetAtom(confirmationDialogAtom);
  const { removeObservedSearch } = useRemoveObservedSearch();
  const { toggleEmailNotification, toggleEmailNotificationInProgress } =
    useToggleEmailNotification();

  const handleRemove = () => {
    confirm({
      message: (
        <DialogContentText>Czy chcesz przestać obserwować to wyszukiwanie?</DialogContentText>
      ),
      onAccept: () =>
        removeObservedSearch(item.id, {
          onSuccess: onReload,
        }),
    });
  };

  const primaryText = useMemo(() => {
    return (
      <>
        {item.category.name}{' '}
        {item.newAnnouncementsCount > 0 && (
          <Typography fontWeight={'bold'} component={'span'} sx={(theme) => ({ color: theme.palette.success.main })}>
            {`(+${item.newAnnouncementsCount})`}
          </Typography>
        )}
      </>
    );
  }, [item]);

  const secondaryText = useMemo(() => {
    const texts: string[] = [];
    texts.push(`${item.ageRange[0]} - ${item.ageRange[1]} lat`);
    texts.push(`do ${item.distanceMax}km`);

    if (item.gender === UserGender.Male) {
      texts.push('Mężczyźni');
    } else if (item.gender === UserGender.Female) {
      texts.push('Kobiety');
    }

    if (item.experienceLevel !== null) {
      texts.push(experienceLevelOptions.find((x) => x.value === item.experienceLevel)!.label);
    }

    return texts.join(', ');
  }, [item]);

  return (
    <Box pb={1}>
      <ListItemButton
        component={Link}
        to={item.resultListUrl}
        key={item.id}
        sx={{ pl: 2, pr: 1, pb: 0 }}
      >
        <ListItemText primary={primaryText} secondary={<>{secondaryText} </>} />
        <IconButton {...withNoPropagation({ onClick: handleRemove })}>
          <Icon name='close' />
        </IconButton>
      </ListItemButton>
      <FormControlLabel
        sx={{ pl: 2 }}
        label={'Powiadomienia e-mail'}
        control={
          <Checkbox
            disabled={toggleEmailNotificationInProgress}
            defaultChecked={item.isEmailNotificationEnabled}
            onChange={(e) => toggleEmailNotification(item.id)}
            size='small'
          />
        }
      />
    </Box>
  );
};
