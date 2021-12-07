import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { LoginLoaderIndicatorService } from '../../login/services/login-loader-indicator.service';

import { MsalService } from '@azure/msal-angular';
import { OAuthSettings } from '../../../oauth';
import { User } from '../../shared/models/user';

import { Client } from '@microsoft/microsoft-graph-client';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import * as moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public graphAuthenticated: boolean;
  public user: User;  
  public urlAttempt: string;  

  constructor( private msalService: MsalService,
               private loginLoaderIndicatorService: LoginLoaderIndicatorService ) { 
    this.graphAuthenticated = this.msalService.getAccount() != null;
    this.getUser().then((user: User) => this.user = user);    
  }

  async signIn(): Promise<void> {
    this.loginLoaderIndicatorService.show();

    let result = await this.msalService.loginPopup(OAuthSettings)
      .catch((reason) => {
        console.log('Login failed', JSON.stringify(reason, null, 2));
      });
      
    if ( result ) {
      this.graphAuthenticated = true;
      this.user = await this.getUser();
      console.log(this.user);
    }
    
    this.loginLoaderIndicatorService.hide();
  }

  // Sign out
  signOut(): void {
    this.msalService.logout();
    this.user = null;
    this.graphAuthenticated = false;    
  }

  private async getUser(): Promise<User> {
    if ( !this.graphAuthenticated ) {
      return null;
    }

    let graphClient = Client.init({
      // Initialize the Graph client with an auth
      // provider that requests the token from the auth service
      authProvider: async(done) => {
        let token = await this.getAccessToken()
          .catch((reason) => {
            done(reason, null);
          });
  
        if ( token ) {
          done(null, token);
        } else {
          done("Could not get an access token", null);
        }
      }
    });
  
    // Get the user from Graph (GET /me)
    let graphUser: MicrosoftGraph.User = await graphClient
      .api('/me')
      .select('id,givenName,surname,displayName,mail,userPrincipalName,mailboxSettings')
      .get();

    let photo = await graphClient.api('/me/photo/$value').get().catch( err => {
      console.log(err);
    });
    let avatar = URL.createObjectURL(new Blob([photo], {type: 'image/jpeg'}));
    let token = await this.getAccessToken();
  
    let user = {
      azure_id: graphUser.id,
      name: graphUser.givenName,
      last_name: graphUser.surname,
      email: graphUser.mail || graphUser.userPrincipalName,
      created_at: Date.now().toLocaleString(),
      avatar: avatar,
      azure_token: token,
      azure_time_zone: graphUser.mailboxSettings.timeZone,
      team_id: null
    }
      
    return user;
  }

  // Silently request an access token
  async getAccessToken(): Promise<string> {

    let result = await this.msalService.acquireTokenSilent(OAuthSettings)
      .catch((reason) => {
        console.log('Get token failed', JSON.stringify(reason, null, 2));
      });

    if (result) {
      // Temporary to display token in an error box
      console.log('Token acquired', result.accessToken);

      return result.accessToken;
    }

    // Couldn't get a token
    return null;
  }
  
  isLogged(url: string) {
    const token = JSON.parse(localStorage.getItem('token'));

    if ( token ) {
      const now = moment(new Date(), "DD-MM-YYYY hh:mm:ss");
      const expires_at = moment(new Date(token.expires_at), "DD-MM-YYYY hh:mm:ss");
      
      return now.isBefore(expires_at);
    }

    this.urlAttempt = url;
    return false;    
  }
}