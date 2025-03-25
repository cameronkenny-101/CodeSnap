import { create } from 'zustand';
import { puzzles, Puzzle, UserProgress, initialUserProgress } from '../utils/puzzles';
import { persist } from 'zustand/middleware';

interface PuzzleState {
  currentPuzzle: Puzzle | null;
  currentSectionIndex: number;
  userProgress: UserProgress;
  isComplete: boolean;
  hasFailedCurrentPuzzle: boolean;

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
      hasFailedCurrentPuzzle: false,

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
          hasFailedCurrentPuzzle: false,
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
          hasFailedCurrentPuzzle: false,
        });
      },

      completeEntirePuzzle: (success: boolean) => {
        const { currentPuzzle, userProgress, hasFailedCurrentPuzzle } = get();
        if (!currentPuzzle) return;

        console.log('[DEBUG] Store completeEntirePuzzle called with success:', success, {
          puzzleId: currentPuzzle.id,
          title: currentPuzzle.title
        });

        let newElo = userProgress.elo;
        
        // Only decrease ELO on first failure and only increase if never failed
        if (success && !hasFailedCurrentPuzzle) {
          newElo += 5;
        } else if (!success && !hasFailedCurrentPuzzle) {
          newElo = Math.max(userProgress.elo - 15, 0);
        }
        
        const updatedProgress = {
          ...userProgress,
          elo: newElo
        };
        
        if (success) {
          updatedProgress.solvedPuzzles = [
            ...userProgress.solvedPuzzles,
            currentPuzzle.id
          ];
          
          // Load next puzzle on success
          const nextIndex = (userProgress.currentPuzzleIndex + 1) % puzzles.length;
          const nextPuzzle = JSON.parse(JSON.stringify(puzzles[nextIndex]));
          
          set({
            userProgress: {
              ...updatedProgress,
              currentPuzzleIndex: nextIndex
            },
            currentPuzzle: nextPuzzle,
            currentSectionIndex: 0,
            isComplete: false,
            hasFailedCurrentPuzzle: false,
          });
        } else {
          set({ 
            userProgress: updatedProgress,
            hasFailedCurrentPuzzle: true,
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