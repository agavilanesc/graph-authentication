import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';

const ICONS_URL: string = `${environment.assets}/data/svg_icons.json`;


@Injectable({
  providedIn: 'root'
})
export class IconApiService {

  constructor(private http: HttpClient) { }

  getIcons(): Observable<any> {
    return this.http.get<any>(ICONS_URL); 
  }
}
