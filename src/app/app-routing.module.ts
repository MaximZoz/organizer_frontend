import { AllUserManagementComponent } from './admin-management/admin-management.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './guards/auth.service';
import { AppToDoListComponent } from './app-to-do-list/app-to-do-list.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'user-management',
    component: UserManagementComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'admin-management',
    component: AllUserManagementComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'to-do-list',
    component: AppToDoListComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
