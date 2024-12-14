import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagementComponent } from './usermanagement/usermanagement.component';
import { ClinicLoginComponent } from './login/login.component';
import { ClinicAuthGuard } from './services/auth.guard';
import { SidenavComponent } from './sidenav/sidenav.component';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    component: ClinicLoginComponent 
  },
  { 
    path: '', 
    component: SidenavComponent,
    children: [
      { 
        path: 'dashboard', 
        component: DashboardComponent,
      },
      { 
        path: 'usermanagement', 
        component: UserManagementComponent 
      },
      // Add other protected routes here
    ]
  },
  { 
    path: '**', 
    redirectTo: 'login' 
  }
];
