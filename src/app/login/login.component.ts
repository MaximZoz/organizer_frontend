import { ResponseModel } from './../Models/responseModel';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Constants } from '../Helper/constants';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { User } from '../Models/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @BlockUI('main-loader') blockUI: NgBlockUI;
  public loginForm = this.formBuilder.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.pattern]],
  });
  constructor(
    private formBuilder: FormBuilder,
    private userServie: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}
  onSubmit() {
    this.blockUI.start();
    let email = this.loginForm.controls['email'].value;
    let password = this.loginForm.controls['password'].value;
    this.userServie.login(email, password).subscribe(
      (data: ResponseModel) => {
        if (data.responseCode == 1) {
          this.toastr.success(data.responseMessage);
          localStorage.setItem(
            Constants.USER_KEY,
            JSON.stringify(data.dateSet)
          );
          let user = data.dateSet as User;
          this.userServie.userEmail = user.email;
          if (user.roles.indexOf('Admin') > -1)
            this.router.navigate(['/admin-management']);
          else {
            this.router.navigate(['/user-management']);
          }
        } else {
          this.loginForm.reset();
          this.toastr.error(data.responseMessage);
        }
        this.blockUI.stop();
      },
      (_error) => {
        this.blockUI.stop();
      }
    );
  }
}
