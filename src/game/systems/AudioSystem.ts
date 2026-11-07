import { useSettingsStore } from '../../stores/settingsStore';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmInterval: number | null = null;
  private isPlayingBgm = false;
  private stepIndex = 0;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private getSfxGain(): number {
    const { muted, masterVolume, sfxVolume } = useSettingsStore.getState();
    if (muted) return 0;
    return masterVolume * sfxVolume;
  }

  private getMusicGain(): number {
    const { muted, masterVolume, musicVolume } = useSettingsStore.getState();
    if (muted) return 0;
    return masterVolume * musicVolume;
  }

  public playUiClick(): void {
    const vol = this.getSfxGain();
    if (vol <= 0.01) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.18 * vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.065);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  }

  public playShoot(): void {
    const vol = this.getSfxGain();
    if (vol <= 0.01) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(480 + Math.random() * 80, now);
    osc.frequency.exponentialRampToValueAtTime(130, now + 0.075);

    gain.gain.setValueAtTime(0.09 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.085);
  }

  public playKlakson(): void {
    const vol = this.getSfxGain();
    if (vol <= 0.01) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Indonesian Telolet / Dual-tone horn chord + sub pulse
    const freqs = [370, 466.16, 554.37];
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, now + idx * 0.02);
      osc.frequency.exponentialRampToValueAtTime(f * 1.06, now + 0.18);

      gain.gain.setValueAtTime(0.08 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    });
  }

  public playUltimateAudio(vehicleId: string): void {
    const vol = this.getSfxGain();
    if (vol <= 0.01) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (vehicleId === 'motor-ojol') {
      // Multi-horn Ojol Convoy "Telolet Solidaritas" fanfare
      const melody = [523.25, 659.25, 783.99, 659.25, 783.99, 1046.5];
      melody.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now + i * 0.09);
        gain.gain.setValueAtTime(0.12 * vol, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.15);
      });
    } else if (vehicleId === 'city-car') {
      // Twin Plasma Laser charge & sweep hum
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);
      osc.frequency.setValueAtTime(660, now + 0.36);
      osc.frequency.linearRampToValueAtTime(440, now + 1.2);
      gain.gain.setValueAtTime(0.16 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.28);
    } else if (vehicleId === 'angkot') {
      // Heavy "Jedag-Jedug" Bass Drop + Rave Synth
      for (let beat = 0; beat < 4; beat++) {
        const t = now + beat * 0.22;
        const sub = ctx.createOscillator();
        const subGain = ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(150, t);
        sub.frequency.exponentialRampToValueAtTime(42, t + 0.19);
        subGain.gain.setValueAtTime(0.28 * vol, t);
        subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        sub.connect(subGain);
        subGain.connect(ctx.destination);
        sub.start(t);
        sub.stop(t + 0.21);

        const lead = ctx.createOscillator();
        const leadGain = ctx.createGain();
        lead.type = 'square';
        lead.frequency.setValueAtTime(beat % 2 === 0 ? 587.33 : 880, t + 0.1);
        leadGain.gain.setValueAtTime(0.09 * vol, t + 0.1);
        leadGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        lead.connect(leadGain);
        leadGain.connect(ctx.destination);
        lead.start(t + 0.1);
        lead.stop(t + 0.21);
      }
    } else if (vehicleId === 'pickup-truck') {
      // Falling Gas Canister Whistle + Cluster Detonation
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.45);
      gain.gain.setValueAtTime(0.15 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
      this.playExplosion(true);
    } else if (vehicleId === 'bajaj') {
      // High-pitched cempreng 2-stroke horn arpeggio & rev
      const notes = [784, 880, 988, 1175, 1318];
      notes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now + i * 0.07);
        gain.gain.setValueAtTime(0.13 * vol, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.13);
      });
      this.playKlakson();
    } else if (vehicleId === 'crazy-rich') {
      // Golden Jackpot chimes + High-Tech Laser Sweeps
      const chimeFrets = [1046.5, 1318.51, 1567.98, 2093.0];
      chimeFrets.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.06);
        gain.gain.setValueAtTime(0.2 * vol, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.3);
      });
      // V12 hyper-engine roar
      const engine = ctx.createOscillator();
      const egain = ctx.createGain();
      engine.type = 'sawtooth';
      engine.frequency.setValueAtTime(140, now);
      engine.frequency.exponentialRampToValueAtTime(840, now + 0.6);
      egain.gain.setValueAtTime(0.18 * vol, now);
      egain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      engine.connect(egain);
      egain.connect(ctx.destination);
      engine.start(now);
      engine.stop(now + 0.68);
    } else if (vehicleId === 'police-car') {
      // High-low European/Indonesian Police Siren ("WII-WUU-WII-WUU") + Radio chirps
      const sirenTones = [880, 660, 880, 660, 988];
      sirenTones.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.14);
        gain.gain.setValueAtTime(0.22 * vol, now + i * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.14 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.14);
        osc.stop(now + i * 0.14 + 0.22);
      });
    } else {
      // Heavy Truck Pantura Deep Air-Horn + Thunder
      [110, 138.59, 164.81].forEach((f) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now);
        gain.gain.setValueAtTime(0.14 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.68);
      });
      this.playLightning();
      this.playExplosion(true);
    }
  }

  public playRocketLaunch(): void {
    const vol = this.getSfxGain();
    if (vol <= 0.01) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.16);

    gain.gain.setValueAtTime(0.12 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.19);
  }

  public playLightning(): void {
    const vol = this.getSfxGain();
    if (vol <= 0.01) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(920, now);
    osc.frequency.setValueAtTime(420, now + 0.04);
    osc.frequency.setValueAtTime(1150, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.15);

    gain.gain.setValueAtTime(0.11 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.17);
  }

  public playExplosion(isBig = false): void {
    const vol = this.getSfxGain();
    if (vol <= 0.01) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = isBig ? 0.42 : 0.22;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isBig ? 480 : 720, now);
    filter.frequency.exponentialRampToValueAtTime(75, now + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime((isBig ? 0.32 : 0.18) * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
  }

  public playXpCollect(): void {
    const vol = this.getSfxGain();
    if (vol <= 0.01) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const base = 680 + Math.random() * 160;
    osc.frequency.setValueAtTime(base, now);
    osc.frequency.exponentialRampToValueAtTime(base * 1.45, now + 0.07);

    gain.gain.setValueAtTime(0.08 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  public playCoinCollect(): void {
    const vol = this.getSfxGain();
    if (vol <= 0.01) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.055); // E6

    gain.gain.setValueAtTime(0.14 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.19);
  }

  public playLevelUp(): void {
    const vol = this.getSfxGain();
    if (vol <= 0.01) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.07);

      gain.gain.setValueAtTime(0.18 * vol, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.3);
    });
  }

  public playBossWarning(): void {
    const vol = this.getSfxGain();
    if (vol <= 0.01) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now + i * 0.25);
      osc.frequency.linearRampToValueAtTime(440, now + i * 0.25 + 0.18);

      gain.gain.setValueAtTime(0.18 * vol, now + i * 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.25 + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.25);
      osc.stop(now + i * 0.25 + 0.23);
    }
  }

  public playPlayerHit(): void {
    const vol = this.getSfxGain();
    if (vol <= 0.01) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(165, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.2);

    gain.gain.setValueAtTime(0.24 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.23);
  }

  public playGameOver(): void {
    const vol = this.getSfxGain();
    if (vol <= 0.01) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [392.0, 349.23, 311.13, 261.63]; // G4 F4 Eb4 C4
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + i * 0.16);

      gain.gain.setValueAtTime(0.16 * vol, now + i * 0.16);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.16 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.16);
      osc.stop(now + i * 0.16 + 0.37);
    });
  }

  public startMusic(): void {
    if (this.isPlayingBgm) return;
    this.isPlayingBgm = true;
    this.stepIndex = 0;

    // Energetic 135 BPM electronic bassline + synth arpeggio
    const bassNotes = [
      110, 110, 220, 110, 130.81, 130.81, 146.83, 164.81,
      110, 110, 220, 110, 98.0, 98.0, 130.81, 146.83,
    ];
    const leadNotes = [
      440, 0, 523.25, 659.25, 587.33, 0, 523.25, 440,
      392, 0, 440, 523.25, 659.25, 587.33, 523.25, 392,
    ];

    this.bgmInterval = window.setInterval(() => {
      const vol = this.getMusicGain();
      if (vol <= 0.01) return;
      const ctx = this.getContext();
      if (!ctx || ctx.state !== 'running') return;

      const now = ctx.currentTime;
      const step = this.stepIndex % 16;
      this.stepIndex++;

      // Driving synth bass
      const bassFreq = bassNotes[step];
      if (bassFreq > 0) {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(bassFreq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(520, now);
        filter.frequency.exponentialRampToValueAtTime(160, now + 0.12);

        gain.gain.setValueAtTime(0.065 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
      }

      // Synth lead pulse on select steps
      const leadFreq = leadNotes[step];
      if (leadFreq > 0 && step % 2 === 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(leadFreq, now);

        gain.gain.setValueAtTime(0.035 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.17);
      }
    }, 115);
  }

  public stopMusic(): void {
    this.isPlayingBgm = false;
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const audioSystem = new SoundEngine();
