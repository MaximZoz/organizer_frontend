import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DateService } from 'src/app/services/date.service';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
})
export class SelectorComponent implements OnInit {
  constructor(public dateService: DateService) {}

  ngOnInit() {}

  go(dir: number): void {
    this.dateService.changeMonth(dir);
  }
}
