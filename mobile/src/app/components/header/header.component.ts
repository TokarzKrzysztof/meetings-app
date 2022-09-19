import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule],
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() title: string = "";

  constructor() {}

  ngOnInit() {}
}
