import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppRoutes } from 'src/app/utils/enums/app-routes';
import { SharedModule } from 'src/app/utils/material/material.module';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-auth-go-back-btn',
  standalone: true,
  imports: [SharedModule, ButtonComponent],
  templateUrl: './auth-go-back-btn.component.html',
  styleUrls: ['./auth-go-back-btn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthGoBackBtnComponent {
  AppRoutes = AppRoutes;
}
