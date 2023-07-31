import { ChangeDetectionStrategy, Component } from '@angular/core';
import { shareReplay } from 'rxjs';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { CategoryService } from 'src/app/services/category.service';
import { SharedModule } from 'src/app/utils/material/material.module';
import { HomeCategoriesSearchComponent } from './home-categories-search/home-categories-search.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [SharedModule, HomeCategoriesSearchComponent, HeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  categories$ = this.categoryService.getAllCategories().pipe(shareReplay());

  constructor(private categoryService: CategoryService) {}
}
