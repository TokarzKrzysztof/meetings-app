import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppRoutes } from '../../../utils/enums/app-routes';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  constructor(private nav: NavController) { }

  ngOnInit() {
  }

  handleGoToLogin() {
    this.nav.navigateForward(AppRoutes.Login);
  }

}
