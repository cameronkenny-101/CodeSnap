import React from 'react';
import { puzzles } from './utils/puzzles';

export function ClearStorage() {
  const clearLocalStorage = () => {
    // Display puzzle information in console
    console.log("=== PUZZLE DEBUG INFO ===");
    console.log("Total puzzle count:", puzzles.length);
    console.log("All puzzle titles:", puzzles.map(p => p.title));
    console.log("All puzzle IDs:", puzzles.map(p => p.id));
    
    // Clear localStorage and refresh
    localStorage.removeItem('code-puzzle-storage');
    console.log("localStorage cleared - reloading app...");
    window.location.reload();
  };

  return (
    <button 
      onClick={clearLocalStorage}
      className="fixed bottom-4 right-4 bg-red-500 text-white px-3 py-1 rounded text-xs"
    >
      Reset Data
    </button>
  );
} 