import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { AuthService } from '../services/auth.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

interface NavItem {
  routeLink: string;
  icon: string;
  label: string;
  expanded?: boolean;
  items?: NavItem[];
}

@Component({
  selector: 'app-usersidenav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate('350ms', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('350ms', style({opacity: 0}))
      ])
    ]),
    trigger('rotate', [
      state('default', style({ transform: 'rotate(0deg)' })),
      state('rotated', style({ transform: 'rotate(90deg)' })),
      transition('default <=> rotated', animate('300ms ease-in-out'))
    ])
  ]
})
export class SidenavComponent implements OnInit, OnDestroy {
  currentDateTime = new Date();
  collapsed = false;
  screenWidth = 0;
  selectedNavItem = '';
  
  // User details
  userName = '';
  userRole = '';

  // Mobile query for responsive design
  mobileQuery: MediaQueryList;
  isCollapsed = false;
  
  private _mobileQueryListener: () => void;

  // Navigation data
  navData: NavItem[] = [
    // {
    //   routeLink: 'home',
    //   icon: 'fas fa-home',
    //   label: 'Home'
    // },
    // {
    //   routeLink: 'feedback',
    //   icon: 'fas fa-users',
    //   label: 'Feedback'
    // },

    // {
    //   routeLink: 'about-us',
    //   icon: 'fas fa-circle-info',
    //   label: 'About Us'
    // },
    // {
    //   routeLink: 'about-us',
    //   icon: 'fas fa-circle-info',
    //   label: 'About Us'
    // }
  ];

  currentDate: Date = new Date();
  private dateTimer: any;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => {
      // Handle mobile query changes
    };
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    // Set up datetime update
    setInterval(() => {
      this.currentDateTime = new Date();
    }, 1000);

    // Load user details
    this.loadUserDetails();

    // Update time every second
    this.dateTimer = setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    if (this.dateTimer) {
      clearInterval(this.dateTimer);
    }
  }

  loadUserDetails(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const currentUser = JSON.parse(userData);
      this.userName = currentUser.name || 'User';
    }

    const roleData = localStorage.getItem('role');
    this.userRole = roleData || 'User Role';
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  closeSidenav(): void {
    this.collapsed = false;
  }

  navigateToDashboard(): void {
    this.selectedNavItem = 'dashboard';
    this.router.navigate(['/home']);
  }
  navigateToProfile(): void {
    this.selectedNavItem = 'profile';
    this.router.navigate(['/profile']);
  }
  navigateToBooking(): void {
    this.selectedNavItem = 'booking';
    this.router.navigate(['/booking']);
  // }

  // navigateToAnnouncement(): void {
  //   this.selectedNavItem = 'announcement';
  //   this.router.navigate(['/announcement']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}