import { UserGender } from 'src/models/user';

export const genderOptions = [
  {
    value: UserGender.Male,
    label: 'Mężczyzna',
  },
  {
    value: UserGender.Female,
    label: 'Kobieta',
  },
];

export const calculateAge = (userBirthDate: string): number => {
  const today = new Date();
  const birthDate = new Date(userBirthDate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};
