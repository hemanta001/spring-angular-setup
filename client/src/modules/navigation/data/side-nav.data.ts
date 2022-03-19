import {SideNavItems, SideNavSection} from '@modules/navigation/models';

export const sideNavSections: SideNavSection[] = [
  {
    text: 'CORE',
    items: ['dashboard', 'user'],
    roles: ['ADMIN', 'BIDDER']
  },
];

export const sideNavItems: SideNavItems = {
  dashboard: {
    icon: 'fas fa-tachometer-alt',
    text: 'Dashboard',
    link: '/dashboard',
    roles: ['ADMIN']
  },
  user: {
    icon: 'fas fa-user',
    text: 'Users',
    roles: ['ADMIN'],
    submenu: [
      {
        text: 'Create',
        link: '/user/create',
        icon: 'fas fa-plus-circle',
        roles: ['ADMIN'],
      },
      {
        text: 'List',
        link: '/user/list',
        icon: 'fas fa-list',
        roles: ['ADMIN'],
      },
    ],

  }
};
