import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { switchMap } from 'rxjs/operators';
import { ResponseCode } from 'src/app/enums/responseCode';
import { Task } from 'src/app/Models/user';
import { DateService } from 'src/app/services/date.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-organaizer',
  templateUrl: './organaizer.component.html',
  styleUrls: ['./organaizer.component.scss'],
})
export class OrganaizerComponent implements OnInit {
  @Input() dayQuantities;
  tasks: Task[] = [];
  form: FormGroup;
  constructor(
    public dateService: DateService,
    public userService: UserService
  ) {}

  ngOnInit() {
    this.dateService.date
      .pipe(
        switchMap((date: any) => {
          console.log('🚀 ~ return');
          return this.userService.getTasks(date.format('DD.MM.YYYY'));
        })
      )
      .subscribe((tasks) => {
        this.tasks = tasks;
      });
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
    });
  }

  nowDate() {
    this.dateService.date.next(moment());
    this.getDayQuantitiesNow();
  }

  submit() {
    const date = this.dateService.date.value.format('DD.MM.YYYY');
    const newTask = new Task();
    newTask.title = this.form.value.title;
    newTask.id = this.generateUUID();
    this.userService.create(newTask, date).subscribe((res) => {
      if (res) {
        this.form.reset();
        newTask.date = this.dateService.date.value.format(
          'YYYY-MM-DDT00:00:00'
        );
        this.tasks.push(newTask);
        const dayQuantities = this.dateService.dayQuantities.value;
        dayQuantities.push(newTask);
        this.dateService.dayQuantities.next(dayQuantities);
      }
    });
  }
  generateUUID() {
    // Public Domain/MIT
    var d = new Date().getTime(); //Timestamp
    var d2 =
      (typeof performance !== 'undefined' &&
        performance.now &&
        performance.now() * 1000) ||
      0; //Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = Math.random() * 16; //random number between 0 and 16
        if (d > 0) {
          //Use timestamp until depleted
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {
          //Use microseconds since page-load if supported
          r = (d2 + r) % 16 | 0;
          d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  }

  remove(id) {
    this.userService.removeTasks(id).subscribe((res) => {
      if ((res.responseCode = ResponseCode.OK)) {
        this.tasks = this.tasks.filter((task) => task.id !== id);

        const dayQuantities = this.dateService.dayQuantities.value.filter(
          (quantity) => quantity.id !== id
        );
        this.dateService.dayQuantities.next(dayQuantities);
      }
    });
  }

  getDayQuantitiesNow() {
    this.userService
      .getTaskMonth(this.dateService.date.value.format('DD.MM.YYYY'))
      .subscribe((dayQuantities) => {
        this.dayQuantities = dayQuantities;
        this.dateService.dayQuantities.next(dayQuantities);
      });
  }
}
