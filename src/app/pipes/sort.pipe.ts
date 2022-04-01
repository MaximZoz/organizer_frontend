import { Pipe, PipeTransform } from '@angular/core';
import { toNumber } from 'lodash';

@Pipe({
  name: 'sort',
  pure: false,
})
export class SortPipe implements PipeTransform {
  transform(value: any) {
    if (value.length !== 0) {
      return value.sort((a, b) => {
        if (!toNumber(a.title)) return -1;
        return a.title - b.title;
      });
    }
    return value;
  }
}
