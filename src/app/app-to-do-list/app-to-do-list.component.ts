import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Constants } from '../Helper/constants';
import { User } from '../Models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-app-to-do-list',
  templateUrl: './app-to-do-list.component.html',
  styleUrls: ['./app-to-do-list.component.scss'],
})
export class AppToDoListComponent implements OnInit {
  @BlockUI('user-loader') blockUI: NgBlockUI;
  form: FormGroup;
  public loaderMessage: string = 'Загрузка';
  public userList: User[] = [];
  selectedUserId: string;
  constructor(private userService: UserService, private fb: FormBuilder) {}
  get user(): User {
    return JSON.parse(localStorage.getItem(Constants.USER_KEY)) as User;
  }

  get isAdmin(): boolean {
    return this.user.roles.indexOf('Admin') > -1;
  }
  ngOnInit(): void {
    this.getAllUser();

    this.form = this.fb.group({
      name: [null],
    });

    this.form.get('name').valueChanges.subscribe((selected) => {
      this.selectedUserId = selected.id;
    });
  }

  getAllUser() {
    this.blockUI.start();
    this.userService.getUserList().subscribe(
      (data: User[]) => {
        this.userList = data.filter(
          (user) => user.roles.length == 1 && user.roles[0] == 'User'
        );
        if (this.isAdmin) {
          this.selectedUserId = this.userList[0].id;
          this.form.get('name').setValue(this.userList[0]);
        } else {
          this.selectedUserId = this.user.id;
          this.form
            .get('name')
            .setValue(this.userList.find((user) => user.id == this.user.id));
        }
        this.blockUI.stop();
      },
      () => {
        this.blockUI.stop();
      }
    );
  }
  compareByID(itemOne, itemTwo) {
    return itemOne && itemTwo && itemOne.ID == itemTwo.ID;
  }
}
