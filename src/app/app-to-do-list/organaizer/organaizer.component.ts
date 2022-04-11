import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { isUndefined } from 'lodash';
import * as moment from 'moment';
import { switchMap } from 'rxjs/operators';
import { ResponseCode } from 'src/app/enums/responseCode';
import { Constants } from 'src/app/Helper/constants';
import { Task, User } from 'src/app/Models/user';
import { DateService } from 'src/app/services/date.service';
import { UserService } from 'src/app/services/user.service';
import { UUID } from '../../Helper/constants';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-organaizer',
  templateUrl: './organaizer.component.html',
  styleUrls: ['./organaizer.component.scss'],
})
export class OrganaizerComponent implements OnInit {
  @Input() selectedUserId;
  tasks: Task[] = [];
  dayQuantities: any;
  form: FormGroup;
  constructor(
    public dateService: DateService,
    public userService: UserService
  ) {}

  drop(event) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    this.tasks.forEach((task, idx) => {
      this.userService.priorityTasks(task.id, idx + 1).subscribe();
      return (task.priority = idx + 1);
    });
  }

  get user(): User {
    return JSON.parse(localStorage.getItem(Constants.USER_KEY)) as User;
  }

  get isAdmin(): boolean {
    return this.user.roles.indexOf('Admin') > -1;
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
    });
  }

  ngOnChanges() {
    if (!isUndefined(this.selectedUserId)) {
      this.dateService.date
        .pipe(
          switchMap((date: any) => {
            return this.userService.getTasks(
              date.format('DD.MM.YYYY'),
              this.selectedUserId
            );
          })
        )
        .subscribe((tasks) => {
          this.tasks = tasks.filter((task) => !task.сonfirm);
        });
      this.getDayQuantitiesNow();
      this.form = new FormGroup({
        title: new FormControl('', Validators.required),
      });
    }
  }

  nowDate() {
    this.dateService.date.next(moment());
    this.getDayQuantitiesNow();
  }

  submit() {
    const date = this.dateService.date.value.format('DD.MM.YYYY');
    const newTask = new Task();
    newTask.title = this.form.value.title;
    newTask.id = UUID();
    newTask.completed = false;
    newTask.priority = this.tasks.length + 1;
    this.userService
      .create(newTask, date, this.selectedUserId)
      .subscribe((res) => {
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
  success(id) {
    this.userService.successTasks(id).subscribe((res) => {
      if ((res.responseCode = ResponseCode.OK)) {
        this.tasks.find((task) => task.id === id).completed = true;

        const dayQuantities = this.dateService.dayQuantities.value;
        dayQuantities.find((quantity) => quantity.id === id).completed = true;

        this.dateService.dayQuantities.next(dayQuantities);
      }
    });
  }

  getDayQuantitiesNow() {
    this.userService
      .getTaskMonth(
        this.dateService.date.value.format('DD.MM.YYYY'),
        this.selectedUserId
      )
      .subscribe((dayQuantities) => {
        this.dayQuantities = dayQuantities.filter((task) => !task.сonfirm);
        this.dateService.dayQuantities.next(this.dayQuantities);
      });
  }
  confirm(id) {
    this.userService.confirmTasks(id).subscribe((res) => {
      if ((res.responseCode = ResponseCode.OK)) {
        this.tasks = this.tasks.filter((task) => task.id !== id);

        const dayQuantities = this.dateService.dayQuantities.value.filter(
          (quantity) => quantity.id !== id
        );
        this.dateService.dayQuantities.next(dayQuantities);
      }
    });
  }
  refuse(id) {
    this.userService.refuseTasks(id).subscribe((res) => {
      if ((res.responseCode = ResponseCode.OK)) {
        this.tasks.find((task) => task.id === id).completed = false;

        const dayQuantities = this.dateService.dayQuantities.value;
        dayQuantities.find((quantity) => quantity.id === id).completed = false;

        this.dateService.dayQuantities.next(dayQuantities);
      }
    });
  }
}
