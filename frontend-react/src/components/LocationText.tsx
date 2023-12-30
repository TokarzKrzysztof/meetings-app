import { useMemo } from "react";
import { useGetLocations } from "src/queries/location-queries";
import { useGetCurrentUser } from "src/queries/user-queries";
import { Typography } from "src/ui-components";
import { getDistanceFromLatLonInKm } from "src/utils/location-utils";

export type LocationTextProps = {
  locationId: string;
};

export const LocationText = ({ locationId }: LocationTextProps) => {
  const { locations } = useGetLocations();
  const { currentUser } = useGetCurrentUser();

  const otherLocation = locations?.find((x) => x.id === locationId);
  const distance = useMemo(() => {
    if (!currentUser || !locations || !otherLocation) return null;

    const currentUserLocation = locations.find((x) => x.id === currentUser.locationId)!;
    return getDistanceFromLatLonInKm(currentUserLocation, otherLocation).toFixed(0);
  }, [locations, currentUser, otherLocation]);

  return (
    <Typography fontSize={14} color='grey'>
      {otherLocation?.city}{' '}
      {distance !== null && <span style={{ whiteSpace: 'nowrap' }}>({distance}km od Ciebie)</span>}
    </Typography>
  );
};
