import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../login/services/auth.service';


@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})
export class MainHeaderComponent implements OnInit {

  get authenticated(): boolean { return this.authService.graphAuthenticated; }

  constructor( private authService: AuthService ) {
  }

  ngOnInit(): void {
  }
}
