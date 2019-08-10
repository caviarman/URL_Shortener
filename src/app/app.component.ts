import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  urlForm;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
  ) {}

  title = 'urlShort';
  ngOnInit() {
    this.urlForm = this.formBuilder.group({
      baseURL: ['', [Validators.required]],
      customURL: [''],
      shortenURL: [''],
    });
  }

  onSubmit(urlForm) {
    console.log('sub', urlForm.value.baseURL);
    if (!!urlForm.value.baseURL) {
      this.api.checkURL({ baseURL: urlForm.value.baseURL}).subscribe(res => {
        console.log('res', res);
      });
    } 
  }
}
