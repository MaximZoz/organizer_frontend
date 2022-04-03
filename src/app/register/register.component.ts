import { ResponseModel } from './../Models/responseModel';
import { Component, OnInit } from '@angular/core';
import {
  Validators,
  FormBuilder,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import { Role } from '../Models/role';
import { UserService } from '../services/user.service';
import { ResponseCode } from '../enums/responseCode';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

export function WrongEmail(arr: any[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    return !arr.includes(control?.value) ? null : { wrongEmail: true };
  };
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public roles: Role[] = [];
  invalidEmails = [];
  public registerForm = this.formBuilder.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.pattern]],
  });
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userServie: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllRoles();
  }
  onSubmit() {
    let fullName = this.registerForm.controls['fullName'].value;
    let email = this.registerForm.controls['email'].value;
    let password = this.registerForm.controls['password'].value;
    this.userServie
      .register(
        fullName,
        email,
        password,
        this.roles.filter((x) => x.isSelected).map((x) => x.role)
      )
      .subscribe(
        (data: ResponseModel) => {
          if (data.responseCode == ResponseCode.OK) {
            this.roles.forEach((x) => (x.isSelected = false));
            this.toastr.success(
              `Вы создали учетную запись, теперь можно войти под ${this.registerForm.controls['email'].value}`
            );
            this.registerForm.controls['fullName'].setValue('');
            this.registerForm.controls['email'].setValue('');
            this.registerForm.controls['password'].setValue('');
            this.router.navigate(['login']);
          } else {
            if (data.dateSet[0].includes('is already taken')) {
              this.toastr.error(this.registerForm.controls['email'].value);
              this.invalidEmails.push(
                this.registerForm.controls['email'].value
              );
              this.registerForm.controls['email'].setValidators(
                WrongEmail(this.invalidEmails)
              );
              this.registerForm.controls['email'].valueChanges;

              this.registerForm.controls['email'].updateValueAndValidity();
            }
          }
        },
        (error) => {
          this.toastr.error('Ошибка, повторите попытку позже');
        }
      );
  }
  getAllRoles() {
    this.userServie.getAllRole().subscribe((roles) => {
      this.roles = roles;
    });
  }
  onRoleChange(role: string) {
    this.roles.forEach((x) => {
      if (x.role == role) {
        x.isSelected = !x.isSelected;
      }
    });
  }

  get isRoleSelected() {
    return this.roles.filter((x) => x.isSelected).length > 0;
  }
}
