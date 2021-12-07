import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

import { User } from '../../shared/models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  get user(): User { return this.authService.user; }
  get graphAuthenticated(): boolean { return this.authService.graphAuthenticated; }

  constructor( private authService: AuthService,
               private router: Router ) { }

  ngOnInit(): void {
    if ( this.graphAuthenticated ) this.router.navigate(['home']);
  }  

  async signIn(): Promise<void> {
    await this.authService.signIn();
    if ( this.graphAuthenticated ) this.router.navigate(['home']);  
  }

  signOut(): void {
    this.authService.signOut();
  }  
}
