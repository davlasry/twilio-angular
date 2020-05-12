import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild, } from '@angular/core';
import Video from 'twilio-video';
import { VideoChatService } from "./services/videochata.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
    @ViewChild('preview', {static: false}) previewElement: ElementRef;

    private activeRoom;
    private roomName = 'test-room-3';
    private participants: Map<Video.Participant.SID, Video.RemoteParticipant>;
    private videoTrack: Video.LocalVideoTrack;
    private localTracks: Video.LocalTrack[] = [];

    constructor(private readonly renderer: Renderer2,
                private videochatService: VideoChatService) {
        window.addEventListener('beforeunload', () => {
            this.activeRoom.disconnect();
        });
    }

    async ngAfterViewInit() {
        const videoOptions = {
            audio: true,
            video: true,
        };

        this.localTracks = await Video.createLocalTracks(videoOptions);

        this.videoTrack = this.localTracks.find(
            (track) => track.kind === 'video'
        ) as Video.LocalVideoTrack;

        if (this.videoTrack) {
            const videoElement = this.videoTrack.attach();
            this.renderer.setStyle(videoElement, 'height', '200px');
            this.renderer.setStyle(videoElement, 'width', '200px');
            this.renderer.setStyle(videoElement, 'border', '2px solid blue');
            this.renderer.appendChild(
                this.previewElement.nativeElement,
                videoElement
            );
        }

        this.activeRoom = await this.videochatService.joinOrCreateRoom(this.roomName, this.localTracks);

        this.initialize(this.activeRoom.participants);
        this.registerRoomEvents();
    }

    initialize(participants: Map<Video.Participant.SID, Video.RemoteParticipant>) {
        this.participants = participants;
        if (this.participants) {
            this.participants.forEach(participant => this.registerParticipantEvents(participant));
        }
    }

    private registerRoomEvents() {
        console.log('registerRoomEvents');
        this.activeRoom
            // .on('disconnected',
            //   (room: Video.Room) => room.localParticipant.tracks.forEach(publication => this.detachLocalTrack(publication.track)))
            .on('participantConnected',
                (participant: Video.RemoteParticipant) => this.add(participant))
            .on('participantDisconnected',
                (participant: Video.RemoteParticipant) => this.remove(participant))
        // .on('dominantSpeakerChanged',
        //   (dominantSpeaker: Video.RemoteParticipant) => this.loudest(dominantSpeaker));
    }

    add(participant: Video.RemoteParticipant) {
        console.log('add participant', participant);
        if (this.participants && participant) {
            this.participants.set(participant.sid, participant);
            this.registerParticipantEvents(participant);
        }
    }

    remove(participant: Video.RemoteParticipant) {
        console.log('remove participant', participant);
        if (this.participants && this.participants.has(participant.sid)) {
            this.participants.delete(participant.sid);
        }
    }

    registerParticipantEvents(participant) {
        console.log('registerParticipantEvents', participant);
        if (participant) {
            participant.tracks.forEach(publication => this.subscribe(publication));
            participant.on('trackPublished', publication => this.subscribe(publication));
            participant.on('trackUnpublished',
                publication => {
                    if (publication && publication.track) {
                        this.detachRemoteTrack(publication.track);
                    }
                });
        }
    }

    attachRemoteTrack(track) {
        console.log('attach track:', track);
        if (this.isAttachable(track)) {
            const element = track.attach();
            this.renderer.setStyle(element, 'height', '200px');
            this.renderer.setStyle(element, 'width', '200px');

            this.renderer.appendChild(
                this.previewElement.nativeElement,
                element
            );
        }
    }

    private subscribe(publication: Video.RemoteTrackPublication | any) {
        if (publication && publication.on) {
            publication.on('subscribed', track => this.attachRemoteTrack(track));
            publication.on('unsubscribed', track => this.detachRemoteTrack(track));
        }
    }

    detachRemoteTrack(track) {
        console.log('detachRemoteTrack');
        track.detach().forEach((detachedElement) => {
            detachedElement.remove();
        });
    }

    private isDetachable(track: Video.RemoteTrack): track is Video.RemoteAudioTrack | Video.RemoteVideoTrack {
        return !!track &&
            ((track as Video.RemoteAudioTrack).detach !== undefined ||
                (track as Video.RemoteVideoTrack).detach !== undefined);
    }

    private isAttachable(track: Video.RemoteTrack): track is Video.RemoteAudioTrack | Video.RemoteVideoTrack {
        return !!track &&
            ((track as Video.RemoteAudioTrack).attach !== undefined ||
                (track as Video.RemoteVideoTrack).attach !== undefined);
    }

    onLeaveRoom() {
        console.log('onLeaveRoom');
        if (this.activeRoom) {
            this.activeRoom.disconnect();
            this.activeRoom = null;
        }
    }
}
