// WebRTC utilities for voice communication

// Config for STUN servers to help with NAT traversal
const rtcConfig: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

// Class to manage WebRTC peer connection
export class WebRTCVoiceCall {
  private peerConnection: RTCPeerConnection;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private isCaller: boolean = false;
  private roomName: string;
  private userId: string;
  private otherUserId: string;
  private onVolumeChange: ((volume: number) => void) | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private volumeTimer: number | null = null;
  
  constructor(roomName: string, userId: string, otherUserId: string) {
    this.peerConnection = new RTCPeerConnection(rtcConfig);
    this.roomName = roomName;
    this.userId = userId;
    this.otherUserId = otherUserId;
    
    // Setup event handlers
    this.setupPeerConnectionHandlers();
  }
  
  // Set up all event handlers for the RTCPeerConnection
  private setupPeerConnectionHandlers() {
    // When remote tracks are received
    this.peerConnection.ontrack = (event) => {
      console.log('Received remote track');
      if (!this.remoteStream) {
        this.remoteStream = new MediaStream();
      }
      
      event.streams[0].getTracks().forEach(track => {
        if (this.remoteStream) {
          this.remoteStream.addTrack(track);
        }
      });
      
      // Play the remote audio
      this.playRemoteAudio();
    };
    
    // When ICE candidates are generated
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignal({
          type: 'ice-candidate',
          candidate: event.candidate
        });
      }
    };
    
    // Connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', this.peerConnection.connectionState);
    };
    
    // ICE connection state changes
    this.peerConnection.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', this.peerConnection.iceConnectionState);
    };
  }
  
  // Initialize the media stream (microphone)
  async initLocalStream(): Promise<void> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });
      
      // Add local stream tracks to the connection
      this.localStream.getAudioTracks().forEach(track => {
        if (this.localStream) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });
      
      console.log('Local stream initialized');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw new Error('Could not access microphone. Please ensure it is connected and permissions are granted.');
    }
  }
  
  // Start the call as the caller
  async startCall(): Promise<void> {
    this.isCaller = true;
    
    try {
      // Create an offer
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      
      // Send the offer to the other user
      this.sendSignal({
        type: 'offer',
        offer: this.peerConnection.localDescription
      });
      
      console.log('Call offer sent');
    } catch (error) {
      console.error('Error starting call:', error);
      throw error;
    }
  }
  
  // Process incoming signals
  async processSignal(signal: any): Promise<void> {
    try {
      if (signal.type === 'offer') {
        // Set the remote description
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(signal.offer));
        
        // Create an answer
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        
        // Send the answer back
        this.sendSignal({
          type: 'answer',
          answer: this.peerConnection.localDescription
        });
        
        console.log('Received offer and sent answer');
      } else if (signal.type === 'answer') {
        // Set the remote description with the received answer
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(signal.answer));
        console.log('Received answer');
      } else if (signal.type === 'ice-candidate') {
        // Add ICE candidate
        try {
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(signal.candidate));
          console.log('Added ICE candidate');
        } catch (e) {
          console.error('Error adding ICE candidate:', e);
        }
      }
    } catch (error) {
      console.error('Error processing signal:', error);
    }
  }
  
  // Send signal to the other user
  private async sendSignal(signal: any): Promise<void> {
    try {
      await fetch('/api/webrtc-signal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomName: this.roomName,
          signal,
          fromUser: this.userId,
          toUser: this.otherUserId
        })
      });
    } catch (error) {
      console.error('Error sending signal:', error);
    }
  }
  
  // Play the remote audio stream
  private playRemoteAudio(): void {
    if (this.remoteStream) {
      const audioElement = document.createElement('audio');
      audioElement.srcObject = this.remoteStream;
      audioElement.autoplay = true;
      audioElement.style.display = 'none';
      document.body.appendChild(audioElement);
      
      console.log('Playing remote audio');
      
      // Set up audio analysis if callback is set
      if (this.onVolumeChange) {
        this.setupAudioAnalysis();
      }
    }
  }
  
  // Set up audio analysis for volume visualization
  private setupAudioAnalysis(): void {
    if (!this.remoteStream || !this.onVolumeChange) return;
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(this.remoteStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      source.connect(this.analyser);
      
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      
      // Start measuring volume
      this.startVolumeDetection();
    } catch (error) {
      console.error('Error setting up audio analysis:', error);
    }
  }
  
  // Start the volume detection loop
  private startVolumeDetection(): void {
    if (!this.analyser || !this.dataArray || !this.onVolumeChange) return;
    
    this.volumeTimer = window.setInterval(() => {
      if (this.analyser && this.dataArray) {
        this.analyser.getByteFrequencyData(this.dataArray);
        
        // Calculate the average volume
        let sum = 0;
        for (let i = 0; i < this.dataArray.length; i++) {
          sum += this.dataArray[i];
        }
        const average = sum / this.dataArray.length;
        
        // Normalize to 0-100
        const normalizedVolume = Math.min(100, average * 2);
        
        // Send volume to callback
        if (this.onVolumeChange) {
          this.onVolumeChange(normalizedVolume);
        }
      }
    }, 100);
  }
  
  // Set callback for volume changes
  setVolumeChangeCallback(callback: (volume: number) => void): void {
    this.onVolumeChange = callback;
    if (this.remoteStream && !this.analyser) {
      this.setupAudioAnalysis();
    }
  }
  
  // Toggle mute status
  toggleMute(mute: boolean): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = !mute;
      });
    }
  }
  
  // End the call
  endCall(): void {
    if (this.volumeTimer) {
      clearInterval(this.volumeTimer);
      this.volumeTimer = null;
    }
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.peerConnection.close();
    
    console.log('Call ended');
  }
}