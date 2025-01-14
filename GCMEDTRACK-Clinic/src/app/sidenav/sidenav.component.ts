import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { fadeInOut, INavbarData } from './helper';
import { navbarData } from './nav-data';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatSidenavModule, 
    MatListModule, 
    MatToolbarModule,
    MatButtonModule
  ],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  animations: [fadeInOut]
})
export class SidenavComponent implements OnInit, OnDestroy {
  @Output() onToggleSideNav = new EventEmitter<SideNavToggle>();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  multiple: boolean = false;
  currentDateTime = new Date();
  mobileQuery: MediaQueryList;
  
  private _mobileQueryListener: () => void;

  constructor(
    public router: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit() {
    setInterval(() => {
      this.currentDateTime = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  // Keep your existing methods...
  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  // ... other existing methods
} 