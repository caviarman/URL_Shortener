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
      customURL: ['', ],
    });
  }

  onSubmit(urlForm) {
    this.error = '';
    this.api.checkURL({ base: urlForm.value.baseURL }).subscribe(res => {
      this.isValidURL = res.data;
      if (this.isValidURL) {
        this.api.shortenURL({
          baseURL: urlForm.value.baseURL,
          customURL: urlForm.value.customURL,
        }).subscribe(res => {
          if (!!res.error) {
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
