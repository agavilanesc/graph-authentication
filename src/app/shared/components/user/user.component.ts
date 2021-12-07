import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../login/services/auth.service';
import { User } from '../../models/user'
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  get user(): User { 
    return this.authService.user; 
  }

  constructor( private authService: AuthService,
               private sanitizer: DomSanitizer ) {
  }

  ngOnInit(): void {
  }
  
  signOut(): void { this.authService.signOut(); }

  logout(): void {
    this.signOut();
  }
  
  me() {
    console.log(this.user);
  }

  getAvatar(user: User) {
    return this.sanitizer.bypassSecurityTrustUrl(user.avatar)
  }
}
