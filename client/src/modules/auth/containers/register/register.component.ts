import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '@modules/auth/services';
import {filter, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

@Component({
    selector: 'app-register',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './register.component.html',
    styleUrls: ['register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  processing = false;
  private unsubscribe$ = new Subject<void>();

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authService: AuthService) {

      this.registerForm = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        avatar: [''],
        role: [''],
        confirmPassword: ['', Validators.required],
        experience: [''],
        mobileNumber: ['', Validators.required]
      }, {
        validator: this.matchPassword
      });
    }

    ngOnInit() {}

  matchPassword(group: FormGroup) {
    // @ts-ignore
    const pass = group.get('password').value!;
    // @ts-ignore
    const confirmPass = group.get('confirmPassword').value;

    return pass === confirmPass ? null : {notSame: true};
  }

  register() {
    this.processing = true;
    this.authService.register(this.registerForm.value).pipe(
      takeUntil(this.unsubscribe$),
      filter((data) => data != null)
    ).subscribe(response => {
      if (response) {
        console.log(response);
        this.processing = false;
        this.router.navigate(['auth/login']);
      }
    });

  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
