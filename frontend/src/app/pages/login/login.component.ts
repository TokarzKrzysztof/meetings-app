import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { SharedModule } from 'src/app/utils/material/material.module';
import { AuthGoBackBtnComponent } from "../../components/auth-go-back-btn/auth-go-back-btn.component";

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SharedModule, HeaderComponent, AuthGoBackBtnComponent]
})
export class LoginComponent {

}
