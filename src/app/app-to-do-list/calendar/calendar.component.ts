import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Week, Day } from 'src/app/Models/calendar';
import { DateService } from 'src/app/services/date.service';
import { groupBy } from 'lodash';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  calendar: Week[];
  dayQuantitiesCompleted = [];
  dayQuantitiesNoCompleted = [];

  constructor(private dateService: DateService) {}

  ngOnInit() {
    this.dateService.dayQuantities.subscribe((dayQuantities) => {
      this.dayQuantitiesCompleted = this.getDayQuantitiesCompleted(dayQuantities);
      this.dayQuantitiesNoCompleted = this.getDayQuantitiesNoCompleted(dayQuantities);
      this.dateService.date.subscribe(this.generate.bind(this));
    });
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
            const quantityCompleted = this.dayQuantitiesCompleted.find((dayQuantities) => {
              return dayQuantities.day == value.format('DD') && !disabled;
            })?.dayQuantities;
            const quantityNoCompleted = this.dayQuantitiesNoCompleted.find((dayQuantities) => {
              return dayQuantities.day == value.format('DD') && !disabled;
            })?.dayQuantities;

            return { value, active, disabled, selected, quantityCompleted, quantityNoCompleted };
          }),
      });
      this.calendar = calendar;
    }
  }

  select(day: Day) {
    this.dateService.changeDate(day.value);
  }

  getDayQuantitiesCompleted(dayQuantities) {
    const groupdayQuantities = groupBy(dayQuantities, 'date');

    const groupdayQuantitiesMap = Object.entries(groupdayQuantities).map(
      (element) => {
        const container = {};
        container['day'] = moment(element[0]).format('DD');
        container['dayQuantities'] = element[1].filter(element => element.completed).length;
        return container;
      }
    );
    return groupdayQuantitiesMap;
  }
  getDayQuantitiesNoCompleted(dayQuantities) {
    const groupdayQuantities = groupBy(dayQuantities, 'date');

    const groupdayQuantitiesMap = Object.entries(groupdayQuantities).map(
      (element) => {
        const container = {};
        container['day'] = moment(element[0]).format('DD');
        container['dayQuantities'] = element[1].filter(element => !element.completed).length;
        return container;
      }
    );
    return groupdayQuantitiesMap;
  }
}
