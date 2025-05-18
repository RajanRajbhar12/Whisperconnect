import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  IMicrophoneAudioTrack
} from 'agora-rtc-sdk-ng';

export class AgoraVoiceCall {
  private client: IAgoraRTCClient;
  private localAudioTrack: IMicrophoneAudioTrack | null = null;
  private remoteUser: IAgoraRTCRemoteUser | null = null;
  private appId: string;
  private channel: string;
  private uid: string;
  private onVolumeChange: ((volume: number) => void) | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private volumeTimer: number | null = null;
  private isMuted: boolean = false;

  constructor(channel: string, uid: string) {
    // Use the hardcoded App ID - make sure it's a string and has no extra spaces
    this.appId = '44227a36ee4f453aa9488aba85009d45'.trim();
    
    console.log('Agora App ID:', this.appId); // For debugging
    
    this.channel = channel;
    this.uid = uid;
    
    // Create the RTC client with specific options
    this.client = AgoraRTC.createClient({ 
      mode: 'rtc',
      codec: 'vp8',
      role: 'host' // Explicitly set role
    });
  
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.client.on('user-published', async (user, mediaType) => {
      console.log('📡 User published:', user.uid, mediaType);

      await this.client.subscribe(user, mediaType);

      if (mediaType === 'audio') {
        this.remoteUser = user;
        
        // Play the remote user's audio track
        user.audioTrack?.play();
        console.log('▶️ Playing remote audio');
        
        if (this.onVolumeChange) {
          this.setupAudioAnalysis(user.audioTrack);
        }
      }
    });

    this.client.on('user-left', user => {
      console.log('👋 User left:', user.uid);
      if (this.remoteUser?.uid === user.uid) {
        this.remoteUser = null;
        
        // Trigger a custom event that can be listened to by the UI component
        const leaveEvent = new CustomEvent('agora-user-left', {
          detail: { uid: user.uid }
        });
        window.dispatchEvent(leaveEvent);
      }
    });

    this.client.on('user-unpublished', (user, mediaType) => {
      console.log('📤 User unpublished:', user.uid, mediaType);
      // Don't trigger the unpublished event for audio if it's just the user muting
      // We only want to trigger this for actual disconnections or unpublishing video
      if (mediaType === 'audio' && this.remoteUser?.uid === user.uid) {
        // Check if the user has actually left or just muted
        // For now we'll just log this instead of dispatching the event
        console.log('Remote user may have muted their audio');
        
        // Only in case of actual disconnection should we dispatch this
        // Don't dispatch event here to prevent false "user left" events
      }
    });

    this.client.on('connection-state-change', (curState, prevState) => {
      console.log(`🔄 Connection state changed: ${prevState} → ${curState}`);
      
      if (curState === 'DISCONNECTED' || curState === 'DISCONNECTING') {
        // Try to reconnect if disconnected
        if (curState === 'DISCONNECTED') {
          console.log('Attempting to reconnect...');
          this.client.join(this.appId, this.channel, null, this.uid)
            .catch(error => {
              console.error('Failed to reconnect:', error);
              const disconnectEvent = new CustomEvent('agora-connection-lost', {
                detail: { state: curState }
              });
              window.dispatchEvent(disconnectEvent);
            });
        } else {
          const disconnectEvent = new CustomEvent('agora-connection-lost', {
            detail: { state: curState }
          });
          window.dispatchEvent(disconnectEvent);
        }
      }
    });

    // Add microphone state change handler
    this.client.on('microphone-changed', async (device: { deviceId: string }) => {
      console.log('🎤 Microphone changed:', device);
      if (this.localAudioTrack) {
        try {
          // Try to switch to the new microphone
          await this.localAudioTrack.setDevice(device.deviceId);
          console.log('✅ Successfully switched to new microphone');
        } catch (error) {
          console.error('❌ Failed to switch microphone:', error);
          // If switching fails, try to recreate the audio track
          try {
            await this.initLocalStream();
            if (this.localAudioTrack && !this.isMuted) {
              await this.client.publish(this.localAudioTrack);
            }
          } catch (retryError) {
            console.error('❌ Failed to recover audio track:', retryError);
          }
        }
      }
    });
  }

  async initLocalStream(): Promise<void> {
    try {
      this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
        encoderConfig: {
          sampleRate: 48000,
          stereo: true,
          bitrate: 128
        },
        // Enhanced audio processing settings
        AEC: true, // Echo cancellation
        AGC: true, // Automatic gain control
        ANS: true  // Automatic noise suppression
      });

      // Set a higher volume to address "AUDIO_INPUT_LEVEL_TOO_LOW" warnings
      // Note: This only affects publishing, not what the user hears
      this.localAudioTrack.setVolume(150); // Increase volume to 150% of normal

      console.log('🎙️ Local audio track created successfully');
    } catch (error) {
      console.error('❌ Error accessing microphone:', error);
      throw new Error('Could not access microphone. Please check permissions.');
    }
  }

  async joinChannel(token: string | null = null): Promise<void> {
    try {
      console.log('🚀 Joining channel with:', {
        appId: this.appId,
        channel: this.channel,
        uid: this.uid,
        token: token ? 'present' : 'null'
      });

      // Add extra validation and error handling
      if (!this.appId || this.appId.trim() === '') {
        throw new Error('Agora App ID is missing or empty');
      }

      // Handle both string and numeric UIDs
      let uidToUse: string | number = this.uid;
      
      // Try to convert to number if it looks numeric
      if (/^\d+$/.test(this.uid)) {
        uidToUse = parseInt(this.uid, 10);
      }
      
      // Join the channel
      await this.client.join(this.appId, this.channel, token, uidToUse);
      console.log('✅ Joined channel successfully with UID:', uidToUse);

      if (this.localAudioTrack) {
        await this.client.publish(this.localAudioTrack);
        console.log('📢 Published local audio track');
      }
      
      // Start a heartbeat to keep the connection alive
      this.startHeartbeat();
    } catch (error) {
      console.error('❌ Error joining channel:', error);
      throw error;
    }
  }
  
  // Add a heartbeat to maintain connection even when muted
  private startHeartbeat() {
    setInterval(() => {
      if (this.client) {
        // Send a dummy RTT measurement to keep connection alive
        this.client.getRTCStats();
      }
    }, 5000); // Every 5 seconds
  }

  private setupAudioAnalysis(audioTrack: any): void {
    if (!audioTrack || !this.onVolumeChange) return;

    try {
      // Check what methods are available on the audioTrack object
      console.log('Audio track methods:', Object.getOwnPropertyNames(audioTrack.__proto__));
      
      // Different ways to get media stream based on the object type
      let mediaStream: MediaStream;
      
      if (typeof audioTrack.getMediaStream === 'function') {
        mediaStream = audioTrack.getMediaStream();
      } else if (typeof audioTrack.getTrack === 'function') {
        // Create a MediaStream from the track
        const track = audioTrack.getTrack();
        mediaStream = new MediaStream([track]);
      } else if (audioTrack._mediaStreamTrack) {
        // Create a MediaStream from the _mediaStreamTrack property
        mediaStream = new MediaStream([audioTrack._mediaStreamTrack]);
      } else {
        console.error('Unable to get media stream from audio track:', audioTrack);
        return;
      }
      
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);

      this.startVolumeDetection();
    } catch (error) {
      console.error('❌ Error setting up audio analysis:', error);
    }
  }

  private startVolumeDetection(): void {
    if (!this.analyser || !this.dataArray || !this.onVolumeChange) return;

    this.volumeTimer = window.setInterval(() => {
      this.analyser!.getByteFrequencyData(this.dataArray!);

      let sum = 0;
      for (let i = 0; i < this.dataArray!.length; i++) {
        sum += this.dataArray![i];
      }

      const average = sum / this.dataArray!.length;
      const normalizedVolume = Math.min(100, average * 2);

      this.onVolumeChange!(normalizedVolume);
    }, 100);
  }

  setVolumeChangeCallback(callback: (volume: number) => void): void {
    this.onVolumeChange = callback;

    if (this.remoteUser?.audioTrack && !this.analyser) {
      this.setupAudioAnalysis(this.remoteUser.audioTrack);
    }
  }

  toggleMute(mute: boolean): void {
    if (this.localAudioTrack) {
      this.isMuted = mute;
      
      // Keep track muted but DO NOT unpublish it
      this.localAudioTrack.setEnabled(!mute);
      console.log(`🔇 Audio track ${mute ? 'muted' : 'unmuted'}`);

      // Previously this would trigger unpublish, which would cause the "user left" event
      // We're now just disabling the track, keeping the connection active
    }
  }

  async leaveChannel(): Promise<void> {
    try {
      if (this.volumeTimer) {
        clearInterval(this.volumeTimer);
        this.volumeTimer = null;
      }

      if (this.localAudioTrack) {
        this.localAudioTrack.stop();
        this.localAudioTrack.close();
        this.localAudioTrack = null;
      }

      if (this.audioContext) {
        this.audioContext.close();
        this.audioContext = null;
      }

      await this.client.leave();
      console.log('👋 Left channel and cleaned up resources');
    } catch (error) {
      console.error('❌ Error leaving channel:', error);
    }
  }
}