
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from './usermanagement/usermanagement.component';
import { ClinicLoginComponent } from './login/login.component';
import { ClinicAuthGuard } from './services/auth.guard';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { MedicalDetailsComponent } from './medical-details/medical-details.component';
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
    children: [
 
      { 
        path: 'dashboard', 
        component: DashboardComponent
      },
      { 
        path: 'usermanagement', 
        component: UserManagementComponent 
      },
      { 
        path: 'appointments', 
        component: AppointmentsComponent 
      },
      { 
        path: 'schedulebooking', 
        component: SchedulebookingComponent
      },
      { 
        path: 'documents', 
        component: DocumentsComponent
      },
      // { 
      //   path: 'medical-details', 
      //   component: MedicalDetailsComponent
      // },
  
        { path: 'medical-details/:user_id', component: MedicalDetailsComponent },
      
      // Add other protected routes here
    ]
  },
  
  { 
    path: '**', 
    redirectTo: 'login' 
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }