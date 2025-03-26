// Audio utilities for sound effects

// Play error sound for incorrect answers
export const playErrorSound = () => {
  try {
    // Create audio context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create oscillator for error beep
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Configure oscillator
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(330, audioContext.currentTime); // Lower frequency for error sound
    
    // Configure gain node (volume)
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // Start at moderate volume
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3); // Fade out
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Play sound
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.error('Error playing sound effect:', error);
  }
};

// Play success sound for correct answers
export const playSuccessSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create oscillator for success sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Configure oscillator for a pleasant "ding"
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(587.33, audioContext.currentTime); // D5 note
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.1); // A5 note
    
    // Configure gain node
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Play sound
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.4);
  } catch (error) {
    console.error('Error playing success sound:', error);
  }
}; 