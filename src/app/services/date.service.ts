import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  constructor() {}
  public date: BehaviorSubject<moment.Moment> = new BehaviorSubject(
    moment().set('hour', 0).set('minute', 0).set('second', 0)
  );
  public dayQuantities: BehaviorSubject<any> = new BehaviorSubject([]);

  changeMonth(dir: number) {
    const val = this.date.value.add(dir, 'M');
    this.date.next(val);
  }

  changeDate(date: moment.Moment) {
    const value = this.date.value.set({
      date: date.date(),
      month: date.month(),
    });
    this.date.next(value);
  }
}
