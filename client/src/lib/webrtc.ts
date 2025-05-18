// WebRTC utilities for voice communication

// Config for STUN servers to help with NAT traversal
const rtcConfig: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' }
  ],
  iceCandidatePoolSize: 10,
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require'
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
  private audioElement: HTMLAudioElement | null = null;
  
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
      console.log('Received remote track:', event.track.kind);
      
      // Use the stream from the event directly
      if (event.streams && event.streams[0]) {
        this.remoteStream = event.streams[0];
        // Play the remote audio
        this.playRemoteAudio();
      }
    };
    
    // When ICE candidates are generated
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('New ICE candidate:', event.candidate.candidate);
        this.sendSignal({
          type: 'ice-candidate',
          candidate: event.candidate
        });
      }
    };
    
    // Connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', this.peerConnection.connectionState);
      if (this.peerConnection.connectionState === 'failed') {
        console.error('Connection failed - attempting to restart ICE');
        this.peerConnection.restartIce();
      }
    };
    
    // ICE connection state changes
    this.peerConnection.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', this.peerConnection.iceConnectionState);
      if (this.peerConnection.iceConnectionState === 'failed') {
        console.error('ICE connection failed - attempting to restart ICE');
        this.peerConnection.restartIce();
      }
    };

    // ICE gathering state changes
    this.peerConnection.onicegatheringstatechange = () => {
      console.log('ICE gathering state:', this.peerConnection.iceGatheringState);
    };

    // Signaling state changes
    this.peerConnection.onsignalingstatechange = () => {
      console.log('Signaling state:', this.peerConnection.signalingState);
    };
  }
  
  // Initialize the media stream (microphone)
  async initLocalStream(): Promise<void> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false
      });
      
      // Add local stream tracks to the connection
      this.localStream.getAudioTracks().forEach(track => {
        console.log('Adding local track to peer connection:', track.kind);
        if (this.localStream) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });
      
      console.log('Local stream initialized successfully');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw new Error('Could not access microphone. Please ensure it is connected and permissions are granted.');
    }
  }
  
  // Start the call as the caller
  async startCall(): Promise<void> {
    this.isCaller = true;
    
    try {
      // Create an offer with specific constraints
      const offerOptions = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: false
      };
      
      const offer = await this.peerConnection.createOffer(offerOptions);
      await this.peerConnection.setLocalDescription(offer);
      
      // Send the offer to the other user
      this.sendSignal({
        type: 'offer',
        offer: this.peerConnection.localDescription
      });
      
      console.log('Call offer sent successfully');
    } catch (error) {
      console.error('Error starting call:', error);
      throw error;
    }
  }
  
  // Process incoming signals
  async processSignal(signal: any): Promise<void> {
    try {
      console.log('Processing signal:', signal.type);
      
      if (signal.type === 'offer') {
        // Set the remote description
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(signal.offer));
        
        // Create an answer
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        
        // Send the answer back
        await this.sendSignal({
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
          if (this.peerConnection.remoteDescription) {
            await this.peerConnection.addIceCandidate(new RTCIceCandidate(signal.candidate));
            console.log('Added ICE candidate successfully');
          } else {
            console.log('Remote description not set yet, storing ICE candidate');
            // Store the ICE candidate to be added when remote description is set
            const originalOnIceCandidate = this.peerConnection.onicecandidate;
            this.peerConnection.onicecandidate = async function(this: RTCPeerConnection, event: RTCPeerConnectionIceEvent) {
              // Call the original handler first
              if (originalOnIceCandidate) {
                originalOnIceCandidate.call(this, event);
              }
              // Then add the stored candidate
              if (event.candidate) {
                await this.addIceCandidate(new RTCIceCandidate(signal.candidate));
                console.log('Added stored ICE candidate successfully');
                // Restore the original handler
                this.onicecandidate = originalOnIceCandidate;
              }
            }.bind(this.peerConnection);
          }
        } catch (e) {
          console.error('Error adding ICE candidate:', e);
        }
      }
    } catch (error) {
      console.error('Error processing signal:', error);
      // If this is an offer or answer, we should try to restart ICE
      if (signal.type === 'offer' || signal.type === 'answer') {
        console.log('Attempting to restart ICE due to signal processing failure');
        this.peerConnection.restartIce();
      }
    }
  }
  
  // Send signal to the other user
  private async sendSignal(signal: any): Promise<void> {
    try {
      const response = await fetch('/api/webrtc-signal', {
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
      }
      
      console.log('Signal sent successfully:', signal.type);
    } catch (error) {
      console.error('Error sending signal:', error);
      // If this is an offer or answer, we should try to restart ICE
      if (signal.type === 'offer' || signal.type === 'answer') {
        console.log('Attempting to restart ICE due to signaling failure');
        this.peerConnection.restartIce();
      }
    }
  }
  
  // Play the remote audio stream
  private playRemoteAudio(): void {
    if (this.remoteStream) {
      // Remove any existing audio element
      if (this.audioElement) {
        this.audioElement.remove();
      }

      // Create new audio element
      this.audioElement = document.createElement('audio');
      this.audioElement.srcObject = this.remoteStream;
      this.audioElement.autoplay = true;
      this.audioElement.style.display = 'none';
      
      // Add event listeners for debugging
      this.audioElement.onloadedmetadata = () => {
        console.log('Audio metadata loaded');
        this.audioElement?.play().catch(e => console.error('Error playing audio:', e));
      };
      
      this.audioElement.onerror = (e) => {
        console.error('Audio element error:', e);
      };

      // Add volume change listener
      this.audioElement.onvolumechange = () => {
        console.log('Audio volume changed:', this.audioElement?.volume);
      };
      
      document.body.appendChild(this.audioElement);
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
        console.log(`Track ${track.kind} ${mute ? 'muted' : 'unmuted'}`);
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
      this.localStream.getTracks().forEach(track => {
        track.stop();
        console.log(`Stopped local track: ${track.kind}`);
      });
      this.localStream = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    if (this.audioElement) {
      this.audioElement.remove();
      this.audioElement = null;
    }
    
    this.peerConnection.close();
    console.log('Call ended and resources cleaned up');
  }
}