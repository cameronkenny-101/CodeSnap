import { create } from 'zustand';
import { puzzles, Puzzle, CodeBlock, UserProgress, initialUserProgress, PuzzleSection } from '../utils/puzzles';
import { persist } from 'zustand/middleware';

interface PuzzleState {
  // Current state
  currentPuzzle: Puzzle | null;
  currentSectionIndex: number;
  userProgress: UserProgress;
  isComplete: boolean;
  
  // Actions
  loadPuzzle: () => void;
  loadNextPuzzle: () => void;
  finishPuzzle: (success: boolean) => void;
  resetCurrentPuzzle: () => void;
  resetAllProgress: () => void;
}

// ELO calculation
const calculateNewElo = (currentElo: number, puzzleDifficulty: number, isWin: boolean): number => {
  const K = 32; // K-factor determines how much the rating changes
  const expectedScore = 1 / (1 + Math.pow(10, (puzzleDifficulty * 200 - currentElo) / 400));
  const actualScore = isWin ? 1 : 0;
  
  return Math.round(currentElo + K * (actualScore - expectedScore));
};

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
        const puzzle = JSON.parse(JSON.stringify(puzzles[index])) as Puzzle;
        
        set({
          currentPuzzle: puzzle,
          currentSectionIndex: 0,
          isComplete: false,
        });
      },
      
      loadNextPuzzle: () => {
        const { userProgress } = get();
        const nextIndex = (userProgress.currentPuzzleIndex + 1) % puzzles.length;
        const nextPuzzle = JSON.parse(JSON.stringify(puzzles[nextIndex])) as Puzzle;
        
        // Update user progress to the next puzzle index
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
      
      finishPuzzle: (success: boolean) => {
        const { currentPuzzle, userProgress } = get();
        if (!currentPuzzle) return;
        
        // Calculate new ELO
        const newElo = calculateNewElo(
          userProgress.elo, 
          currentPuzzle.difficulty, 
          success
        );
        
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
        }
        
        set({ userProgress: updatedProgress });
        
        // If successful, we'll automatically load the next puzzle
        if (success) {
          get().loadNextPuzzle();
        }
      },
      
      resetCurrentPuzzle: () => {
        const { userProgress } = get();
        const index = userProgress.currentPuzzleIndex % puzzles.length;
        const puzzle = JSON.parse(JSON.stringify(puzzles[index])) as Puzzle;
        
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