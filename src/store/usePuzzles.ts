import { create } from 'zustand';
import { puzzles, Puzzle, UserProgress, initialUserProgress } from '../utils/puzzles';
import { persist } from 'zustand/middleware';

interface PuzzleState {
  currentPuzzle: Puzzle | null;
  currentSectionIndex: number;
  userProgress: UserProgress;
  isComplete: boolean;
  hasFailedCurrentPuzzle: boolean;
  isDeveloperMode: boolean;
  developerSettings: {
    forceCorrect: boolean;
    customElo: number | null;
  };

  loadPuzzle: () => void;
  loadNextPuzzle: () => void;
  completeEntirePuzzle: (success: boolean) => void;
  resetCurrentPuzzle: () => void;
  resetAllProgress: () => void;
  toggleDeveloperMode: () => void;
  updateDeveloperSettings: (settings: Partial<PuzzleState['developerSettings']>) => void;
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
      isDeveloperMode: false,
      developerSettings: {
        forceCorrect: false,
        customElo: null
      },

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
        const { currentPuzzle, userProgress, hasFailedCurrentPuzzle, developerSettings } = get();
        if (!currentPuzzle) return;

        // If developer mode is forcing correct answers, always treat as success
        const isSuccess = developerSettings.forceCorrect ? true : success;

        console.log('[DEBUG] Store completeEntirePuzzle called with success:', isSuccess, {
          puzzleId: currentPuzzle.id,
          title: currentPuzzle.title,
          forceCorrect: developerSettings.forceCorrect
        });

        let newElo = userProgress.elo;

        // Only modify ELO if we're not using a custom ELO
        if (developerSettings.customElo === null) {
          if (isSuccess && !hasFailedCurrentPuzzle) {
            newElo += 5;
          } else if (!isSuccess && !hasFailedCurrentPuzzle) {
            newElo = Math.max(userProgress.elo - 15, 0);
          }
        }

        const updatedProgress = {
          ...userProgress,
          elo: newElo
        };

        if (isSuccess) {
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
      },

      toggleDeveloperMode: () => {
        set(state => ({ isDeveloperMode: !state.isDeveloperMode }));
      },

      updateDeveloperSettings: (settings) => {
        const { userProgress } = get();
        set(state => {
          const newSettings = {
            ...state.developerSettings,
            ...settings
          };

          // If customElo is set, immediately update the user's ELO
          if (settings.customElo !== undefined) {
            set({
              userProgress: {
                ...userProgress,
                elo: settings.customElo ?? userProgress.elo
              }
            });
          }

          return {
            developerSettings: newSettings
          };
        });
      }
    }),
    {
      name: 'code-puzzle-storage'
    }
  )
);

export default usePuzzleStore; 