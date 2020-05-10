import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import Video from 'twilio-video';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('preview', { static: false }) previewElement: ElementRef;

  apiBaseUrl = environment.apiBaseUrl;
  token: string;
  activeRoom;

  private videoTrack: Video.LocalVideoTrack;
  private localTracks: Video.LocalTrack[] = [];

  constructor(private http: HttpClient, private readonly renderer: Renderer2) {}

  ngAfterViewInit() {
    this.http
      .get(`${this.apiBaseUrl}/token`)
      .subscribe(async (results: any) => {
        /* Make an API call to get the token and identity(fake name) and  update the corresponding state variables. */
        const { identity, token } = results;
        console.log('identity:', identity);
        this.token = token;
        console.log('this.token:', this.token);
        console.log('results:', results);

        const videoOptions = {
          audio: true,
          video: true,
        };

        const localTracks = await Video.createLocalTracks(videoOptions);
        console.log('localTracks:', localTracks);

        this.videoTrack = localTracks.find(
          (t) => t.kind === 'video'
        ) as Video.LocalVideoTrack;
        if (this.videoTrack) {
          console.log('inside videoTrack:');
          const videoElement = this.videoTrack.attach();
          this.renderer.setStyle(videoElement, 'height', '100%');
          this.renderer.setStyle(videoElement, 'width', '100%');
          this.renderer.appendChild(
            this.previewElement.nativeElement,
            videoElement
          );
        }

        const connectOptions = {
          name: 'test-room',
          tracks: localTracks,
          video: { width: 300 },
          // logLevel: 'debug',
        };

        // Join the Room with the token from the server and the
        // LocalParticipant's Tracks.
        await Video.connect(this.token, connectOptions).then(
          this.roomJoined.bind(this),
          (error) => {
            console.log('Could not connect to Twilio: ' + error.message);
          }
        );
      });
  }

  roomJoined(room) {
    this.activeRoom = room;
    console.log('room:', this.activeRoom);
  }
}
