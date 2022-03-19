import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserRole} from '@modules/auth/models/UserRole';
import {UserService} from '@modules/user/services';
import {ActivatedRoute} from '@angular/router';
import {ResponseModel} from '@common/models';
import {User} from '@modules/auth/models';
import {AppCommonService} from '@common/services';
import {NotificationService} from '@app/notification/notification.service';
import {Subject} from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  private file?: File;
  userForm!: FormGroup;
  roles: string[] = [];
  processing = false;
  userId?: string;
  @ViewChild('avatar')
  fileField?: ElementRef;
  selectedRoles: string[] = [];
  isRoleEmployeeSelected?: boolean;
  isRoleTenantSelected?: boolean;


  constructor(private userService: UserService,
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private commonService: AppCommonService,
              private notifyService: NotificationService,
  ) {
  }

  ngOnInit(): void {
    for (const key in UserRole) {
      this.roles.push(key);
    }
    this.initializeForm$();
    this.activatedRoute.params.subscribe(params => {
      this.userId = params._id;
      if (this.userId) {
        this.userService.getById$(this.userId).subscribe((data: ResponseModel<User>) => {
          this.userForm?.patchValue(data.data);
        });
      }
    });
  }

  initializeForm$ = () => {
    this.userForm = this.fb.group({
      _id: [],
      email: ['', Validators.required],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      avatar: [''],
      roles: [, Validators.required],
    });

  };

  create$ = () => {
    this.processing = true;
    this.userId ? (this.userService.put$(this.userId, this.userForm?.value).subscribe(data => {
        this.notifyService.showSuccess$('updated !!', 'success');
        this.processing = false;
      }, error => {
        this.notifyService.showError$('failed !!', 'error');
      })) :
      this.userService.post$(this.userForm?.value).subscribe(data => {
          this.notifyService.showSuccess$('created !!', 'success');
          this.userForm?.reset();
          this.userForm?.patchValue({roles: [this.roles]});
          this.processing = false;
        }, error => {
          this.notifyService.showError$('failed !!', 'error');
        }
      );
  };

  ngOnDestroy(): void {
  }

}
