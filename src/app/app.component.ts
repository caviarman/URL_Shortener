import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from './api.service';
import { environment } from './../environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  urlForm;
  host = environment.host;
  shortenURL;
  title = 'urlShort';
  isValidURL = true;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
  ) { }


  pattern = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/);
  ngOnInit() {
    this.urlForm = this.formBuilder.group({
      baseURL: ['', [Validators.required, Validators.pattern(this.pattern)]],
      customURL: ['', [Validators.maxLength(10)]],
    });
  }

  onSubmit(urlForm) {
    this.error = '';
    console.log('sub', urlForm.value.baseURL);
    this.api.checkURL({ base: urlForm.value.baseURL }).subscribe(res => {
      console.log('res.data', res.data);
      this.isValidURL = res.data;
      if (this.isValidURL) {
        this.api.shortenURL({
          baseURL: urlForm.value.baseURL,
          customURL: urlForm.value.customURL,
        }).subscribe(res => {
          console.log('res', res);
          if (!!res.error) {
            console.log('res.error', res.error);
            this.error = res.error;
          }
          if (!!res.shortenURL) {
            this.shortenURL = `${this.host}/x/${res.shortenURL}`;
          }
        });
      }
    });

  }
}
