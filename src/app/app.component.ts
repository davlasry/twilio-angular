import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import Video from 'twilio-video';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  apiBaseUrl = environment.apiBaseUrl;
  token: string;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get(`${this.apiBaseUrl}/token`).subscribe((results: any) => {
      /*
  Make an API call to get the token and identity(fake name) and  update the corresponding state variables.
      */
      const { identity, token } = results;
      this.token = token;
      console.log('this.token:', this.token);
      console.log('results:', results);
    });
  }
}
