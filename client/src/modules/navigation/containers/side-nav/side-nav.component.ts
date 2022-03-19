import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '@modules/auth/services';
import {SideNavItem, SideNavItems, SideNavSection} from '@modules/navigation/models';
import {NavigationService} from '@modules/navigation/services';
import {Subscription} from 'rxjs';
import {User} from '@modules/auth/models';

@Component({
  selector: 'app-side-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './side-nav.component.html',
  styleUrls: ['side-nav.component.scss'],
})
export class SideNavComponent implements OnInit, OnDestroy {
  @Input() sidenavStyle!: string;
  @Input() sideNavItems!: SideNavItems;
  @Input() sideNavSections!: SideNavSection[];
  user?: User;
  subscription: Subscription = new Subscription();
  routeDataSubscription!: Subscription;

  constructor(public navigationService: NavigationService, public userService: UserService) {
  }

  ngOnInit() {
    this.subscription.add(this.userService.user$.subscribe((user: User) => {
      this.user = user;
      this.sideNavSections = this.sideNavSections.filter((sideNavSection: SideNavSection) => {
        const sideNavSectionRoles = sideNavSection?.roles?.filter((role: string) => {
          return (this.user?.roles?.indexOf(this.userService.role$(role))) !== -1;
        });
        sideNavSection.items = sideNavSection.items.filter((item) => {
          const sideNavItemRoles = this.sideNavItems[item]?.roles?.filter((role: string) => {
            return (this.user?.roles?.indexOf(this.userService.role$(role))) !== -1;
          });
          if (sideNavItemRoles?.length) {
            this.sideNavItems[item].submenu = this.sideNavItems[item]?.submenu?.filter((subMenu: SideNavItem) => {
              const subMenuRoles = subMenu.roles?.filter((role: string) => {
                return (this.user?.roles?.indexOf(this.userService.role$(role))) !== -1;
              });
              if (subMenuRoles?.length) {
                return subMenu;
              }
            });
            if (this.sideNavItems[item].submenu?.length === 0) {
              return;
            }
            return item;
          }
        });

        if (sideNavSectionRoles?.length) {
          return sideNavSection;
        }
      });
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
