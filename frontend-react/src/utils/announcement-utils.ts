import { AnnouncementExperienceLevel } from 'src/models/annoucement/announcement';

export const experienceLevelOptions = [
  {
    value: AnnouncementExperienceLevel.Begginer,
    label: 'Początkujący',
  },
  {
    value: AnnouncementExperienceLevel.Indermediate,
    label: 'Średniozaawansowany',
  },
  {
    value: AnnouncementExperienceLevel.Advanced,
    label: 'Zaawansowany',
  },
  {
    value: AnnouncementExperienceLevel.Professional,
    label: 'Profesjonalny',
  },
] as const;
