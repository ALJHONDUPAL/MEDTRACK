
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from './usermanagement/usermanagement.component';
import { ClinicLoginComponent } from './login/login.component';
import { ClinicAuthGuard } from './services/auth.guard';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { SchedulebookingComponent } from './schedulebooking/schedulebooking.component';
import { DocumentsComponent } from './documents/documents.component';
import { DashboardComponent } from './dashboard/dashboard.component';

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
    canActivate: [ClinicAuthGuard],
    children: [
 
      { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [ClinicAuthGuard]
      },
      { 
        path: 'usermanagement', 
        component: UserManagementComponent,
        canActivate: [ClinicAuthGuard]
      },
      { 
        path: 'appointments', 
        component: AppointmentsComponent,
        canActivate: [ClinicAuthGuard]
      },
      { 
        path: 'schedulebooking', 
        component: SchedulebookingComponent,
        canActivate: [ClinicAuthGuard]
      },
      { 
        path: 'documents', 
        component: DocumentsComponent,
        canActivate: [ClinicAuthGuard]
      },
    ]
  },
  
  { 
    path: '**', 
    redirectTo: 'dashboard' 
  }
];
