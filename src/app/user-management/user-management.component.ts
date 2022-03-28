import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../Models/user';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BlockUiTemplateComponent } from '../sharedModule/block-ui-template/block-ui-template.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  @BlockUI('user-loader') blockUI: NgBlockUI;
  public blockUiTemplateComponent = BlockUiTemplateComponent;
  public loaderMessage: string = 'Загрузка';
  public userList: User[] = [];
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getAllUser();
  }

  getAllUser() {
    this.blockUI.start();
    this.userService.getUserList().subscribe(
      (data: User[]) => {
        this.userList = data.filter(
          (user) => user.roles.length == 1 && user.roles[0] == 'User'
        );
        this.blockUI.stop();
      },
      () => {
        this.blockUI.stop();
      }
    );
  }
}
