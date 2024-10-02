import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface NavItem {
  displayName: string;
  mobileDisplayName?: string;
  isActive?: boolean;
  iconDefault: string;
  iconActive: string;
  route?: string;
  children?: NavItem[];
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  navbarItems: NavItem[] = [
    {
      displayName: 'Home',
      isActive: false,
      iconDefault: 'assets/icons/icon-home-default.svg',
      iconActive: 'assets/icons/icon-home-active.svg',
      route: '/dashboard/home',
    },
    {
      displayName: 'Tasks',
      isActive: false,
      iconDefault: 'assets/icons/icon-calendar-default.svg',
      iconActive: 'assets/icons/icon-calendar-active.svg',
      route: '/dashboard/tasks',
    },
    {
      displayName: 'Profile',
      isActive: false,
      iconDefault: 'assets/icons/icon-profile-default.svg',
      iconActive: 'assets/icons/icon-profile-active.svg',
      route: '/dashboard/settings',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateActiveItem();
    this.router.events.subscribe(() => {
      this.updateActiveItem();
    });
  }

  updateActiveItem(): void {
    const activeRoute = this.router.url;
    this.navbarItems.forEach((item) => {
      item.isActive = item.route === activeRoute;
    });
  }
}
