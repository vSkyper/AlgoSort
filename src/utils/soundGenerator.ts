class SoundGenerator {
  private context: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private volume: number = 0.05;

  private init() {
    if (!this.context) {
      this.context = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      this.gainNode = this.context.createGain();
      this.gainNode.connect(this.context.destination);
    }
  }

  public playTone(value: number, max: number = 100) {
    this.init();
    if (!this.context || !this.gainNode) return;

    if (this.context.state === 'suspended') {
      this.context.resume();
    }

    const minFreq = 120;
    const maxFreq = 1200;
    const frequency = minFreq + (value / max) * (maxFreq - minFreq);

    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator.disconnect();
    }

    this.oscillator = this.context.createOscillator();
    this.oscillator.type = 'triangle'; // Smoother sound than square/sawtooth
    this.oscillator.frequency.value = frequency;

    // Ramp volume to avoid clicking
    this.gainNode.gain.setValueAtTime(0, this.context.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(
      this.volume,
      this.context.currentTime + 0.01
    );
    // Short duration for the beep
    this.gainNode.gain.linearRampToValueAtTime(
      0,
      this.context.currentTime + 0.1
    );

    this.oscillator.connect(this.gainNode);
    this.oscillator.start();
    this.oscillator.stop(this.context.currentTime + 0.1);
  }
}

export const soundGenerator = new SoundGenerator();
