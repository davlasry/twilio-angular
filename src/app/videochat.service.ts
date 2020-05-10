import { Injectable } from '@angular/core';
import { connect, ConnectOptions, LocalTrack, Room } from 'twilio-video';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject, Observable } from 'rxjs';

interface AuthToken {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class VideochatService {
  constructor() {}
}
