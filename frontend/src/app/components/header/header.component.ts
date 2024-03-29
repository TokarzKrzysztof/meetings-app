import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppRoutes } from 'src/app/utils/enums/app-routes';
import { SharedModule } from 'src/app/utils/material/material.module';

@Component({
  selector: 'header[app-header]',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  AppRoutes = AppRoutes;
}
