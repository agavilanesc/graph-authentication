import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { ProgressIndicatorService } from './progress-indicator.service'
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProgressIndicatorInterceptorService implements HttpInterceptor {

  constructor( private progressIndicatorService: ProgressIndicatorService ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
            .pipe(
              tap(value => this.progressIndicatorService.show()),
              finalize(() => this.progressIndicatorService.hide())
            );    
  };
}
