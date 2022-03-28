import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { User } from '../Models/user';
import { UserService } from '../services/user.service';
import { BlockUiTemplateComponent } from '../sharedModule/block-ui-template/block-ui-template.component';

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.scss'],
})
export class AllUserManagementComponent implements OnInit {
  @BlockUI('user-loader') blockUI: NgBlockUI;
  public blockUiTemplateComponent = BlockUiTemplateComponent;
  public loaderMessage: string = 'loading test';
  public userList: User[] = [];
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getAllUser();
  }

  getAllUser() {
    this.blockUI.start();
    this.userService.getAllUser().subscribe(
      (data: User[]) => {
        this.userList = data.filter((user) => {
          if (user.roles.length == 1) {
            return user.roles[0] !== 'User';
          }
          return user.roles && user.roles[0] !== undefined;
        });
        this.blockUI.stop();
      },
      () => {
        this.blockUI.stop();
      }
    );
  }
}
