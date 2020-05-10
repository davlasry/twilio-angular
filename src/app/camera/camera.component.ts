import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Renderer2,
} from '@angular/core';
import { createLocalTracks, LocalTrack, LocalVideoTrack } from 'twilio-video';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent implements AfterViewInit {
  @ViewChild('preview', { static: false }) previewElement: ElementRef;

  get tracks(): LocalTrack[] {
    return this.localTracks;
  }

  isInitializing = true;

  private videoTrack: LocalVideoTrack;
  private localTracks: LocalTrack[] = [];

  constructor(private readonly renderer: Renderer2) {}

  ngAfterViewInit() {
    if (this.previewElement && this.previewElement.nativeElement) {
      // this.initializeDevice();
    }
  }
}
