import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { DateService } from 'src/app/services/date.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-organaizer',
  templateUrl: './organaizer.component.html',
  styleUrls: ['./organaizer.component.scss'],
})
export class OrganaizerComponent implements OnInit {
  form: FormGroup;
  constructor(
    public dateService: DateService,
    public userService: UserService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
    });
  }
  nowDate() {
    this.dateService.date.next(moment());
  }
  submit() {
    this.userService.create(this.form.value).subscribe();
    this.form.reset();
  }
}
