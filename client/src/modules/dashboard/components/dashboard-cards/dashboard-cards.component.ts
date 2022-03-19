import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {UserService} from '@modules/auth/services';
import {User} from '@modules/auth/models';

@Component({
  selector: 'app-dashboard-cards',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-cards.component.html',
  styleUrls: ['dashboard-cards.component.scss'],
})
export class DashboardCardsComponent implements OnInit {
  user?: User;

  constructor(public userService: UserService) {

  }

  ngOnInit() {
    this.userService.user$.subscribe((user: User) => {
      this.user = user;
    });
  }
}
