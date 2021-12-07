import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../login/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  get graphAuthenticated(): boolean { return this.authService.graphAuthenticated; }
  
  constructor( private authService: AuthService,
               private router: Router ) { }

  ngOnInit(): void {
    if ( !this.graphAuthenticated ) this.router.navigate(['login']);
  }

}
