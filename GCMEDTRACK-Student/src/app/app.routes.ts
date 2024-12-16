import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SidenavComponent } from './sidenav/sidenav.component'; 
import { AuthGuard } from './services/auth.guard';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BookingComponent } from './booking/booking.component';

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
      { 
        path: 'profile', 
        component: ProfileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'booking',
        component: BookingComponent,
        canActivate: [AuthGuard]
      },
    ]
  },
  { 
    path: '**', 
    redirectTo: 'login' 
  }
];