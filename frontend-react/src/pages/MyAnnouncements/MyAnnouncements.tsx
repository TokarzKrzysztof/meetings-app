import { Header } from 'src/components/Header/Header';
import { useGetCurrentUserAnnouncements } from 'src/queries/announcement-queries';
import { useGetAllCategories } from 'src/queries/category-queries';

export const MyAnnouncements = () => {
  const { currentUserAnnoucements } = useGetCurrentUserAnnouncements();
  const { allCategories } = useGetAllCategories();

  return (
    <>
      <Header />
    </>
  );
};

MyAnnouncements.displayName = 'MyAnnouncements';
