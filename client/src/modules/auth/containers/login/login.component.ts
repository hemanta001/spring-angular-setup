import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {AuthService, UserService} from '@modules/auth/services';
import {filter, takeUntil} from 'rxjs/operators';
import {Router} from '@angular/router';
import {NotificationService} from '@app/notification/notification.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  processing = false;
  private unsubscribe$ = new Subject<void>();
  isAdminRegistered = true;
  url = environment.baseUrl;

  constructor(private fb: FormBuilder,
              private router: Router,
              private userService: UserService,
              private authService: AuthService,
              private notificationService: NotificationService,
              private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.isAdminCreated$();
  }

  login() {
    this.processing = true;
    this.authService.login(this.loginForm.value).pipe(
      takeUntil(this.unsubscribe$),
      filter(data => data != null)
    ).subscribe((response: any) => {
      this.processing = false;
      if (response) {
        // this.userService.user = jwtDecode(response.token);
        AuthService.setAccessToken$(response.access_token);
        AuthService.setRefreshToken$(response.refresh_token);
        this.router.navigateByUrl('/dashboard').then();
        this.userService.get$().subscribe(data => {
          console.log(data);
        });
      }
    }, error => {
      this.processing = false;
      const errorMessage = error.error.error;
      const message = errorMessage === 'unauthorized' ? 'invalid user' : 'something went wrong';
      this.notificationService.showError$(message, 'error');
    });
  }

  isAdminCreated$ = () => this.http.get(`${this.url}users/isAdminRegistered`)
    .pipe(
      takeUntil(this.unsubscribe$),
      filter(data => data != null)
    )
    .subscribe((data: any) => {
      this.isAdminRegistered = data.isAdminRegistered;
    })


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
