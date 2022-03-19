import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthService, UserService} from '@modules/auth/services';
import {Router} from '@angular/router';

@Component({
  selector: 'app-top-nav-user',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './top-nav-user.component.html',
  styleUrls: ['top-nav-user.component.scss'],
})
export class TopNavUserComponent implements OnInit {
  constructor(public userService: UserService, private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
  }

  logout() {
    this.authService.logout().subscribe(data => {
      AuthService.removeRefreshToken$();
      AuthService.removeAccessToken$();
      this.router.navigateByUrl('auth/login').then(logout => {
        location.reload();
      });
    });

  }
}
