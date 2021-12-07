import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { LoginLoaderIndicatorService } from '../../login/services/login-loader-indicator.service';
import { Observable } from 'rxjs';
import { delay, finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingInterceptorService implements HttpInterceptor {

  constructor(private loginLoaderIndicatorService: LoginLoaderIndicatorService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
            .pipe(
              tap(value => this.loginLoaderIndicatorService.show()),
              //delay(3000),
              finalize(() => this.loginLoaderIndicatorService.hide())
            )
  };
}
