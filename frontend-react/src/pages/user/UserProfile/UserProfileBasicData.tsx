import dayjs from 'dayjs';
import { useMemo } from 'react';
import { UserGender } from 'src/models/user';
import { UserProfile } from 'src/models/user-profile';
import { UserProfileCard } from 'src/pages/user/UserProfile/UserProfileCard';
import { useGetLocations } from 'src/queries/location-queries';
import { Icon, List, ListItem, ListItemIcon, ListItemText } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';
import { calculateAge } from 'src/utils/user-utils';

export type UserProfileBasicDataProps = {
  userProfile: UserProfile;
  isCurrentUser: boolean;
};

export const UserProfileBasicData = ({ userProfile, isCurrentUser }: UserProfileBasicDataProps) => {
  const { locations } = useGetLocations();

  const locationName = useMemo(() => {
    if (!locations) return null;

    const { city, adminName } = locations.find((x) => x.id === userProfile.user.locationId)!;
    return `${city}, ${adminName}`;
  }, [locations, userProfile]);

  const birthDateText = useMemo(() => {
    const dateText = dayjs(userProfile.user.birthDate).toDate().toLocaleDateString()
    return `${dateText} (${calculateAge(userProfile.user.birthDate)} lat)`
  }, [userProfile])

  return (
    <UserProfileCard
      title='Dane podstawowe'
      showEditButton={isCurrentUser}
      editLink={AppRoutes.MyProfileChangeData()}
    >
      <List disablePadding>
        <ListItem disableGutters disablePadding>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Icon name={userProfile.user.gender === UserGender.Male ? 'male' : 'female'}></Icon>
          </ListItemIcon>
          <ListItemText
            primary={userProfile.user.gender === UserGender.Male ? 'Mężczyzna' : 'Kobieta'}
          />
        </ListItem>
        <ListItem disableGutters disablePadding>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Icon name={'cake'}></Icon>
          </ListItemIcon>
          <ListItemText primary={birthDateText} />
        </ListItem>
        <ListItem disableGutters disablePadding>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Icon name={'place'}></Icon>
          </ListItemIcon>
          <ListItemText primary={locationName} />
        </ListItem>
      </List>
    </UserProfileCard>
  );
};
