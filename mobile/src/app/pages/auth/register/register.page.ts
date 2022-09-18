import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RadioOption } from '../../../components/UI/radio-group/radio-group.component';
import { UserGender } from '../../../models/user';
import { AppRoutes } from '../../../utils/enums/app-routes';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  readonly genderOptions: RadioOption[] = [
    { text: 'Mężczyzna', value: UserGender.Male },
    { text: 'Kobieta', value: UserGender.Female },
  ];
  
  constructor(private nav: NavController) {}

  ngOnInit() {}

  handleGoToLogin() {
    this.nav.navigateForward(AppRoutes.Login);
  }

  handleRegister() {

  }
}
