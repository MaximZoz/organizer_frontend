import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { DateService } from 'src/app/services/date.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
})
export class SelectorComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  dayQuantities: any;
  constructor(
    public dateService: DateService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getDayQuantities();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  go(dir: number): void {
    this.dateService.changeMonth(dir);
    this.getDayQuantities();
  }

  getDayQuantities() {
    const userService$ = this.userService
      .getTaskMonth(this.dateService.date.value.format('DD.MM.YYYY'))
      .subscribe((dayQuantities) => {
        this.dayQuantities = dayQuantities;
        this.dateService.dayQuantities.next(dayQuantities);
      });
    this.subscriptions.push(userService$);
  }
}
