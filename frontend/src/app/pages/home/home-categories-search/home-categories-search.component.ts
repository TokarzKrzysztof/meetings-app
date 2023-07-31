import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { Category } from 'src/app/models/category';
import { AppRoutes } from 'src/app/utils/enums/app-routes';
import { SharedModule } from 'src/app/utils/material/material.module';
import { TypedChanges } from 'src/app/utils/types/typed-changes';

@Component({
  selector: 'app-home-categories-search',
  standalone: true,
  templateUrl: './home-categories-search.component.html',
  styleUrls: ['./home-categories-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedModule],
})
export class HomeCategoriesSearchComponent {
  @Input({ required: true }) categories!: Category[] | null;

  AppRoutes = AppRoutes;
  searchControl = new FormControl<string>('');
  filteredCategories$?: Observable<Category[]>;
  isButtonDisabled$ = this.searchControl.valueChanges.pipe(
    startWith(this.searchControl.value),
    map((value) => !this.categories?.some((x) => x.id === value))
  );

  ngOnChanges(changes: TypedChanges<HomeCategoriesSearchComponent>) {
    if (changes.categories?.currentValue !== null) {
      this.filteredCategories$ = this.searchControl.valueChanges.pipe(
        startWith(''),
        map((value) => this.filter(value || '', this.categories!))
      );
    }
  }

  private filter(value: string, allCategories: Category[]): Category[] {
    const filterValue = value.toLowerCase();

    return allCategories.filter((x) => x.name.toLowerCase().includes(filterValue));
  }

  displayFn(id: string) {
    return this.categories?.find((x) => x.id === id)?.name ?? '';
  }
}
