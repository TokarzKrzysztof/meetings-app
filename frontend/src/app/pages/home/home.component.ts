import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { delay, shareReplay } from 'rxjs';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { CategoryService } from 'src/app/services/category.service';
import { MaterialModule } from 'src/app/utils/material/material.module';
import { HomeCategoriesSearchComponent } from './home-categories-search/home-categories-search.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, MaterialModule, HomeCategoriesSearchComponent, HeaderComponent],
})
export class HomeComponent {
  categories$ = this.categoryService.getAllCategories().pipe(delay(2000), shareReplay());

  constructor(private categoryService: CategoryService) {}
}
