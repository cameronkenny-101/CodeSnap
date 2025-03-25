import { create } from 'zustand';
import { puzzles, Puzzle, UserProgress, initialUserProgress } from '../utils/puzzles';
import { persist } from 'zustand/middleware';

interface PuzzleState {
  currentPuzzle: Puzzle | null;
  currentSectionIndex: number;
  userProgress: UserProgress;
  isComplete: boolean;
  
  loadPuzzle: () => void;
  loadNextPuzzle: () => void;
  completeEntirePuzzle: (success: boolean) => void;
  resetCurrentPuzzle: () => void;
  resetAllProgress: () => void;
}

const usePuzzleStore = create<PuzzleState>()(
  persist(
    (set, get) => ({
      currentPuzzle: null,
      currentSectionIndex: 0,
      userProgress: initialUserProgress,
      isComplete: false,
      
      loadPuzzle: () => {
        const { userProgress } = get();
        const index = userProgress.currentPuzzleIndex % puzzles.length;
        const puzzle = JSON.parse(JSON.stringify(puzzles[index]));
        
        console.log('[DEBUG] Store loadPuzzle:', { 
          puzzleIndex: index, 
          puzzleId: puzzle.id,
          title: puzzle.title
        });
        
        set({
          currentPuzzle: puzzle,
          currentSectionIndex: 0,
          isComplete: false,
        });
      },
      
      loadNextPuzzle: () => {
        const { userProgress } = get();
        const nextIndex = (userProgress.currentPuzzleIndex + 1) % puzzles.length;
        const nextPuzzle = JSON.parse(JSON.stringify(puzzles[nextIndex]));
        
        console.log('[DEBUG] Store loadNextPuzzle:', { 
          fromIndex: userProgress.currentPuzzleIndex,
          toIndex: nextIndex,
          puzzleId: nextPuzzle.id,
          title: nextPuzzle.title
        });
        
        set({
          userProgress: {
            ...userProgress,
            currentPuzzleIndex: nextIndex
          },
          currentPuzzle: nextPuzzle,
          currentSectionIndex: 0,
          isComplete: false,
        });
      },
      
      completeEntirePuzzle: (success: boolean) => {
        const { currentPuzzle, userProgress } = get();
        if (!currentPuzzle) return;
        
        console.log('[DEBUG] Store completeEntirePuzzle called with success:', success, {
          puzzleId: currentPuzzle.id,
          title: currentPuzzle.title
        });
        
        // Calculate new ELO
        const newElo = Math.max(userProgress.elo + (success ? 5 : -15), 0);
        
        // Update user progress
        const updatedProgress = {
          ...userProgress,
          elo: newElo
        };
        
        if (success) {
          updatedProgress.solvedPuzzles = [
            ...userProgress.solvedPuzzles,
            currentPuzzle.id
          ];
          
          set({ 
            userProgress: updatedProgress,
            isComplete: true
          });
          
          // Load next puzzle only on explicit success
          const nextIndex = (userProgress.currentPuzzleIndex + 1) % puzzles.length;
          // Use JSON parse/stringify for a true deep copy
          const nextPuzzle = JSON.parse(JSON.stringify(puzzles[nextIndex]));
          
          console.log('[DEBUG] Store preparing next puzzle after completion:', {
            nextIndex,
            nextPuzzleId: nextPuzzle.id,
            nextPuzzleTitle: nextPuzzle.title
          });
          
          set({
            userProgress: {
              ...updatedProgress,
              currentPuzzleIndex: nextIndex
            },
            currentPuzzle: nextPuzzle,
            currentSectionIndex: 0,
            isComplete: false,
          });
        } else {
          // Only update ELO on failure, don't move to next puzzle
          // User will decide whether to retry or advance manually
          set({ 
            userProgress: updatedProgress
          });
        }
      },
      
      resetCurrentPuzzle: () => {
        const { userProgress } = get();
        const index = userProgress.currentPuzzleIndex % puzzles.length;
        const puzzle = JSON.parse(JSON.stringify(puzzles[index]));
        
        console.log('[DEBUG] Store resetCurrentPuzzle:', {
          puzzleId: puzzle.id,
          title: puzzle.title
        });
        
        set({
          currentPuzzle: puzzle,
          currentSectionIndex: 0,
          isComplete: false,
        });
      },
      
      resetAllProgress: () => {
        set({
          userProgress: initialUserProgress,
          currentPuzzle: null,
          currentSectionIndex: 0,
          isComplete: false,
        });
        get().loadPuzzle();
      }
    }),
    {
      name: 'code-puzzle-storage'
    }
  )
);

export default usePuzzleStore; 