import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(
    value: string,
    limit: number = 100,
    ellipsis: string = '...'
  ): string {
    if (value.length > limit) {
      for (; ' .,'.indexOf(value[limit]) !== 0; limit--) {}

      return value.slice(0, limit) + ellipsis
    }

    return value
  }
}
