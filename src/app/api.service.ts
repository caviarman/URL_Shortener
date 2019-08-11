import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  host = environment.host;

  constructor(
    private http: HttpClient,
  ) { }
  shortenURL(data): Observable<any> {
    return this.http.post<any>(`${this.host}/api/shortenURL`, data);
  }
  checkURL(data): Observable<any> {
    return this.http.post<any>(`${this.host}/api/checkURL`, data);
  }
}
