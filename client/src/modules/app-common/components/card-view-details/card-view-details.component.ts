import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {User} from '@modules/auth/models';
import {UserService} from '@modules/auth/services';

@Component({
  selector: 'app-card-view-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card-view-details.component.html',
  styleUrls: ['card-view-details.component.scss'],
})
export class CardViewDetailsComponent implements OnInit {
  @Input() background!: string;
  @Input() color!: string;
  @Input() menuName = '';
  user?: User;
  customClasses: string[] = [];
  processing = false;

  constructor(private userService: UserService) {
    this.userService.user$.subscribe((user: User) => {
      this.user = user;
    });
  }

  ngOnInit() {
    if (this.background) {
      this.customClasses.push(this.background);
    }
    if (this.color) {
      this.customClasses.push(this.color);
    }
  }

}
