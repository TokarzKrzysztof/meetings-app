import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppRoutes } from '../../../utils/enums/app-routes';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(private nav: NavController) {}

  ngOnInit() {}

  handleGoToRegister() {
    this.nav.navigateForward(AppRoutes.Register);
  }
}
