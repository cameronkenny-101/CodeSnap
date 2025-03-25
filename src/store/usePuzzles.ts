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


const getPuzzlesForElo = (elo: number, allPuzzles: Puzzle[]) => {
  if (elo <= 500) {
    return allPuzzles.filter(p => p.difficulty <= 2);
  } else if (elo <= 1000) {
    return allPuzzles.filter(p => p.difficulty >= 2 && p.difficulty <= 3);
  } else {
    return allPuzzles.filter(p => p.difficulty >= 4);
  }
};

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

        // Get eligible puzzles based on ELO
        const eligiblePuzzles = getPuzzlesForElo(userProgress.elo, puzzles);

        if (eligiblePuzzles.length === 0) {
          console.warn('No eligible puzzles found for current ELO:', userProgress.elo);
          return;
        }

        // Get a random puzzle from eligible ones
        const randomIndex = Math.floor(Math.random() * eligiblePuzzles.length);
        const nextPuzzle = JSON.parse(JSON.stringify(eligiblePuzzles[randomIndex]));

        set({
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