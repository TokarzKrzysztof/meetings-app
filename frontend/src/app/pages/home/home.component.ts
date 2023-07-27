import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { MaterialModule } from 'src/app/utils/material/material.module';
import { HomeCategoriesSearchComponent } from "./home-categories-search/home-categories-search.component";

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [CommonModule, MaterialModule, HomeCategoriesSearchComponent, HeaderComponent]
})
export class HomeComponent {
    isLoading = false;
}
