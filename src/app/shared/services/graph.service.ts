import { Injectable } from '@angular/core';
import { Client } from '@microsoft/microsoft-graph-client';
import { AuthService } from '../../login/services/auth.service';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

@Injectable({
  providedIn: 'root'
})

export class GraphService {

  private graphClient: Client;

  constructor( private authService: AuthService ) {

    // Initialize the Graph client
    this.graphClient = Client.init({
      authProvider: async (done) => {        

        const token = await this.authService.getAccessToken() // Get the token from the auth service
          .catch((reason) => {
            done(reason, null);
          });

        if (token) {
          done(null, token);
          
        } else {
          done("Could not get an access token", null);
        }
      }
    });
  }

  async getCalendarView(start: string, end: string, timeZone: string): Promise<MicrosoftGraph.Event[] | undefined> {
    try {
      // GET /me/calendarview?startDateTime=''&endDateTime=''
      // &$select=subject,organizer,start,end
      // &$orderby=start/dateTime
      // &$top=50
      const result =  await this.graphClient
        .api('/me/calendarview')
        .header('Prefer', `outlook.timezone="${timeZone}"`)
        .query({
          startDateTime: start,
          endDateTime: end
        })
        .select('subject,organizer,start,end,isCancelled')
        .orderby('start/dateTime')
        .top(100)
        .get();

      return result.value;

    } catch (error) {
      console.log('Could not get events', JSON.stringify(error, null, 2));
    }
    return undefined;
  }
}