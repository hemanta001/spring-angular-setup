import {Component, OnInit} from '@angular/core';
import {UserService} from '@modules/user/services';
import {User} from '@modules/auth/models';
import {ResponseModel} from '@common/models';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users?: User[];

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {
    this.userService.getAll$().subscribe((data: any) => {
      this.users = data.content;
    });
  }

  edit$ = (_id: string) => {
    this.router.navigate(['user', 'edit', _id]).then();
  }
}
