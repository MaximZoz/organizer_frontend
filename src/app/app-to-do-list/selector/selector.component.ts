import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { DateService } from 'src/app/services/date.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/Models/user';
import { FormBuilder, FormGroup } from '@angular/forms';
import { isUndefined } from 'lodash';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
})
export class SelectorComponent implements OnInit, OnDestroy {
  @Input() selectedUserId;
  private subscriptions: Subscription[] = [];
  dayQuantities: any;
  constructor(
    public dateService: DateService,
    private userService: UserService
  ) {}

  ngOnInit() {
    if (!isUndefined(this.selectedUserId)) {
      this.getDayQuantities();
    }
  }

  ngOnChanges() {}

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  go(dir: number): void {
    this.dateService.changeMonth(dir);
    this.getDayQuantities();
  }

  getDayQuantities() {
    const userService$ = this.userService
      .getTaskMonth(
        this.dateService.date.value.format('DD.MM.YYYY'),
        this.selectedUserId
      )
      .subscribe((dayQuantities) => {
        this.dayQuantities = dayQuantities.filter((task) => !task.сonfirm);
        this.dateService.dayQuantities.next(this.dayQuantities);
      });
    this.subscriptions.push(userService$);
  }
}
