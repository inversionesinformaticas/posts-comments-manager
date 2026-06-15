import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '../../core/utils/date.util';

@Pipe({
  name: 'dateFormat',
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) {
      return '';
    }

    return formatDate(value);
  }
}
