// Sound effects using Web Audio API
export function playSuccessSound(): void {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const now = audioContext.currentTime;
  
  // Create a quick upward pitch sound
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  osc.connect(gain);
  gain.connect(audioContext.destination);
  
  osc.frequency.setValueAtTime(523.25, now); // C5
  osc.frequency.setValueAtTime(783.99, now + 0.05); // G5
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.setValueAtTime(0, now + 0.1);
  
  osc.start(now);
  osc.stop(now + 0.1);
}

export function playFriesCollectSound(): void {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const now = audioContext.currentTime;
  
  // Create a "ding" sound
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  osc.connect(gain);
  gain.connect(audioContext.destination);
  
  osc.frequency.setValueAtTime(1000, now);
  osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.setValueAtTime(0, now + 0.2);
  
  osc.start(now);
  osc.stop(now + 0.2);
}

export function playTransformSound(): void {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const now = audioContext.currentTime;
  
  // Create "whoosh" sound with two oscillators
  const osc1 = audioContext.createOscillator();
  const osc2 = audioContext.createOscillator();
  const gain1 = audioContext.createGain();
  const gain2 = audioContext.createGain();
  const masterGain = audioContext.createGain();
  
  osc1.connect(gain1);
  osc2.connect(gain2);
  gain1.connect(masterGain);
  gain2.connect(masterGain);
  masterGain.connect(audioContext.destination);
  
  // Frequency sweep down
  osc1.frequency.setValueAtTime(400, now);
  osc1.frequency.exponentialRampToValueAtTime(100, now + 0.15);
  gain1.gain.setValueAtTime(0.2, now);
  gain1.gain.setValueAtTime(0, now + 0.15);
  
  osc2.frequency.setValueAtTime(600, now);
  osc2.frequency.exponentialRampToValueAtTime(150, now + 0.15);
  gain2.gain.setValueAtTime(0.15, now);
  gain2.gain.setValueAtTime(0, now + 0.15);
  
  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 0.15);
  osc2.stop(now + 0.15);
}

export function playAchievementSound(): void {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const now = audioContext.currentTime;
  
  // Triumphant chord - play three notes
  const playNote = (freq: number, time: number) => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.15, time);
    gain.gain.setValueAtTime(0, time + 0.3);
    
    osc.start(time);
    osc.stop(time + 0.3);
  };
  
  // Play C, E, G chord
  playNote(261.63, now); // C4
  playNote(329.63, now); // E4
  playNote(392.0, now); // G4
}

export function playErrorSound(): void {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const now = audioContext.currentTime;
  
  // Low "error" buzzer
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  osc.connect(gain);
  gain.connect(audioContext.destination);
  
  osc.frequency.setValueAtTime(150, now);
  osc.frequency.setValueAtTime(100, now + 0.1);
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.setValueAtTime(0, now + 0.2);
  
  osc.start(now);
  osc.stop(now + 0.2);
}
