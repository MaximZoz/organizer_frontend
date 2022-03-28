import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Week, Day } from 'src/app/Models/calendar';
import { DateService } from 'src/app/services/date.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  calendar: Week[];

  constructor(private dateService: DateService) {}

  ngOnInit() {
    this.dateService.date.subscribe(this.generate.bind(this));
  }

  generate(now: moment.Moment) {
    const startDay = now.clone().startOf('M').startOf('W');
    const endDay = now.clone().endOf('M').endOf('W');
    const date = startDay.clone().subtract(1, 'd');

    const calendar = [];

    while (date.isBefore(endDay, 'd')) {
      calendar.push({
        days: Array(7)
          .fill(0)
          .map(() => {
            const value = date.add(1, 'd').clone();
            const active = moment().isSame(value, 'date');
            const disabled = !now.isSame(value, 'M');
            const selected = now.isSame(value, 'date');
            return { value, active, disabled, selected };
          }),
      });
      this.calendar = calendar;
    }
  }

  select(day: Day) {
    this.dateService.changeDate(day.value);
  }
}
