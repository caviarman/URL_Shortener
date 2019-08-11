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

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
  ) {}

  title = 'urlShort';
  isValidURL = true;
  pattern = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/);
  ngOnInit() {
    this.urlForm = this.formBuilder.group({
      baseURL: ['', [Validators.required, Validators.pattern(this.pattern)]],
      customURL: ['', []],
    });
  }

  onSubmit(urlForm) {
    console.log('sub', urlForm.value.baseURL);
    if (!!urlForm.value.baseURL) {
      this.api.shortenURL({ 
        baseURL: urlForm.value.baseURL,
        customURL: urlForm.value.customURL,
      }).subscribe(res => {
        console.log('res', res);
        this.isValidURL = res.isValidURL;
        if (!!res.shortenURL) {
          this.shortenURL = `${this.host}/x/${res.shortenURL}`;
        }
      });
    } 
  }
}
