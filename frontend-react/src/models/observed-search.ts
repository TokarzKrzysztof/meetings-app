import { Category } from 'src/models/category';
import { ResultListFilters } from 'src/utils/announcement-result-list-utils';

export type ObservedSearch = ResultListFilters & {
  id: string;
  category: Category;
  newAnnouncementsCount: number;
  isEmailNotificationEnabled: boolean;
  resultListUrl: string
};
