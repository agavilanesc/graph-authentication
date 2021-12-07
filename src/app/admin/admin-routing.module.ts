import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';

import { LoginCanActivateGuard } from '../login/guards/login-can-activate.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [LoginCanActivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
