import { Directive } from '@angular/core';
import { ApiService } from './api.service';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function isValidUrl(apiService: ApiService): AsyncValidatorFn {
  return (c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return apiService.checkURL(c.value).pipe(
      map(res => {
        console.log('dddddddddd', res);
        console.log('sssssssss', c.value);
        return res.data ? null : { 'isValidUrl': false }
      })
    )
  }
}

@Directive({
  selector: '[appValidUrlValidator]'
})
export class ValidUrlValidatorDirective {

  constructor() { }

}
