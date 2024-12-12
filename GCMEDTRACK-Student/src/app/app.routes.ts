import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [

    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component:LoginComponent},
    {path: 'sidenav', component:SidenavComponent, canActivate: [AuthGuard]},
];
