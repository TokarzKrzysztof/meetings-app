import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { Category } from 'src/app/models/category';
import { MaterialModule } from 'src/app/utils/material/material.module';
import { TypedChanges } from 'src/app/utils/types/typed-changes';

@Component({
  selector: 'app-home-categories-search',
  standalone: true,
  templateUrl: './home-categories-search.component.html',
  styleUrls: ['./home-categories-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
})
export class HomeCategoriesSearchComponent {
  @Input({ required: true }) categories!: Category[] | null;

  searchControl = new FormControl<string>('');
  filteredCategories?: Observable<Category[]>;

  constructor(private router: Router) {
  }

  ngOnChanges(changes: TypedChanges<HomeCategoriesSearchComponent>) {
    if (changes.categories?.currentValue !== null) {
      this.filteredCategories = this.searchControl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || '', this.categories!))
      );
    }
  }

  private _filter(value: string, allCategories: Category[]): Category[] {
    const filterValue = value.toLowerCase();

    return allCategories.filter((x) => x.name.toLowerCase().includes(filterValue));
  }

  displayFn(id: string) {
    return this.categories?.find((x) => x.id === id)?.name ?? '';
  }

  onSelectOption() {
    this.router.navigate(['./'] , {queryParams: {categoryId: this.searchControl.value}})
    console.log('selected')
  }
}
