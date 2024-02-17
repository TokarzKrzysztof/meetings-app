import { useMemo } from 'react';
import { AnnouncementExperienceLevel } from 'src/models/annoucement/announcement';
import { Typography } from 'src/ui-components';
import { experienceLevelOptions } from 'src/utils/announcement-utils';

export type ExperienceLevelProps = {
  level: AnnouncementExperienceLevel | null;
};

export const ExperienceLevel = ({ level }: ExperienceLevelProps) => {
  const levelTxt = useMemo(() => {
    if (level === null) return null;
    return experienceLevelOptions.find((x) => x.value === level)!.label;
  }, [level]);

  if (!levelTxt) return null;
  return <Typography fontSize={12} color={'grey'}>{`(${levelTxt})`}</Typography>;
};
