import { InfiniteScroll } from 'src/components/InfiniteScroll';
import { PageTitle } from 'src/components/PageTitle';
import { Header } from 'src/components/header/Header';
import { ObservedSearchesListItem } from 'src/pages/account/ObservedSearches/ObservedSearchesListItem';
import { useGetCurrentUserObservedSearches } from 'src/queries/observed-search-queries';
import {
  Container,
  List,
  Typography
} from 'src/ui-components';

export const ObservedSearches = () => {
  const {
    currentUserObservedSearches,
    currentUserObservedSearchesFetchNextPage,
    currentUserObservedSearchesHasNextPage,
    currentUserObservedSearchesFetching,
    currentUserObservedSearchesRefetch,
  } = useGetCurrentUserObservedSearches();

  return (
    <>
      <Header />
      <Container disableXSpacing>
        <PageTitle>Obserwowane wyszukiwania</PageTitle>
        <List>
          <InfiniteScroll
            direction='down'
            next={currentUserObservedSearchesFetchNextPage}
            hasMore={!!currentUserObservedSearchesHasNextPage}
            isFetching={currentUserObservedSearchesFetching}
          >
            {(currentUserObservedSearches ?? []).map((x) => (
              <ObservedSearchesListItem key={x.id} item={x} onReload={currentUserObservedSearchesRefetch} />
            ))}
          </InfiniteScroll>
        </List>
        {currentUserObservedSearches && !currentUserObservedSearches.length && (
          <Typography mt={6} textAlign='center' color='grey'>
            Nie obserwujesz żadnych wyszukiwań
          </Typography>
        )}
      </Container>
    </>
  );
};

ObservedSearches.displayName = 'ObservedSearches';
