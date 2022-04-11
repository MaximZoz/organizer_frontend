import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { toNumber } from 'lodash';

@Pipe({
  name: 'sort',
  pure: false,
})
export class SortPipe implements PipeTransform {
  transform(value: any) {
    if (value.length !== 0) {
      return _.sortBy(value, 'priority');
    }
    return value;
  }
}
