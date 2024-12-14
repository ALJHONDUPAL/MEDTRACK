import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SidenavComponent } from './sidenav/sidenav.component'; 
import { AuthGuard } from './services/auth.guard';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: '', 
    component: SidenavComponent,
    canActivate: [AuthGuard],
    children: [
      { 
        path: 'home', 
        component: HomeComponent,
        canActivate: [AuthGuard],
      },
    ]
  },
  { 
    path: '**', 
    redirectTo: 'login' 
  }
];