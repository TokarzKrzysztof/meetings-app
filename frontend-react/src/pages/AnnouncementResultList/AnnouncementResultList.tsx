import { useSearchParams } from 'react-router-dom';
import { Header } from 'src/components/Header/Header';
import { AnnouncementResultListItem } from 'src/pages/AnnouncementResultList/AnnouncementResultListItem/AnnouncementResultListItem';
import { useGetAllCategories } from 'src/queries/category-queries';
import { Container, Stack, Typography } from 'src/ui-components';

const nameOf = <T,>(name: keyof T) => name;
type SearchParams = {
  categoryId: string;
  maxAge: string;
};

const useAnnouncementResultListSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setParams = (params: SearchParams) => {
    setSearchParams(params);
  };

  const stringParam = (name: keyof SearchParams) => {
    return searchParams.get(name);
  };
  const numberParam = (name: keyof SearchParams) => {
    const value = searchParams.get(name);
    return value ? +value : null;
  };
  return [
    {
      categoryId: stringParam('categoryId')!,
      maxAge: numberParam('maxAge'),
    },
    setParams,
  ] as const;
};

export const AnnouncementResultList = () => {
  const [{ categoryId, maxAge }, setParams] = useAnnouncementResultListSearchParams();
  const { allCategories } = useGetAllCategories();
  // useEffect(() => {
  //   if(searchParams?.get())
  // }, [searchParams])
  console.log(maxAge);

  const categoryName = allCategories?.find((x) => x.id === categoryId)?.name;
  return (
    <>
      <Header />
      <Container>
        <Typography my={2}>
          Ogłoszenia z kategorii:{' '}
          <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{categoryName}</span>
        </Typography>
        <Stack direction='column' gap={2}>
          <AnnouncementResultListItem />
          <AnnouncementResultListItem />
        </Stack>
      </Container>
    </>
  );
};

AnnouncementResultList.displayName = 'AnnouncementResultList';
