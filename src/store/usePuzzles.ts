import { create } from 'zustand';
import { puzzles, Puzzle, UserProgress, initialUserProgress } from '../utils/puzzles';
import { persist } from 'zustand/middleware';

// Force using the current puzzles array instead of whatever might be in localStorage
console.log("Available puzzles:", puzzles.length, puzzles.map(p => p.title));

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
  puzzlesLoaded: boolean;
  puzzlesLength: number;

  loadPuzzle: () => void;
  loadPuzzleByIndex: (index: number) => void;
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

// Check if we need to migrate persisted state due to new puzzles
const migratePuzzles = (persistedState: any): any => {
  if (persistedState && persistedState.state) {
    // If the puzzles array has more elements than what's in localStorage,
    // reset the state to force using the current puzzles array
    if (!persistedState.state.puzzlesLoaded ||
      !persistedState.state.puzzlesLength ||
      persistedState.state.puzzlesLength !== puzzles.length) {
      console.log("Migrating puzzle state due to new puzzles", {
        oldLength: persistedState.state.puzzlesLength,
        newLength: puzzles.length
      });
      return {
        ...persistedState,
        state: {
          currentPuzzle: null,
          currentSectionIndex: 0,
          userProgress: initialUserProgress,
          isComplete: false,
          puzzlesLoaded: true,
          puzzlesLength: puzzles.length,
          hasFailedCurrentPuzzle: false,
          isDeveloperMode: false,
          developerSettings: {
            forceCorrect: false,
            customElo: null
          }
        }
      };
    }
  }
  return persistedState;
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
      puzzlesLoaded: true,
      puzzlesLength: puzzles.length,

      loadPuzzle: () => {
        const { userProgress } = get();
        // Always ensure we have the latest puzzles
        const index = userProgress.currentPuzzleIndex % puzzles.length;
        const puzzle = JSON.parse(JSON.stringify(puzzles[index]));

        console.log('[DEBUG] Store loadPuzzle:', {
          puzzleIndex: index,
          puzzleId: puzzle.id,
          title: puzzle.title,
          totalPuzzles: puzzles.length,
          allPuzzleTitles: puzzles.map(p => p.title)
        });

        set({
          currentPuzzle: puzzle,
          currentSectionIndex: 0,
          isComplete: false,
        });
      },

      loadPuzzleByIndex: (index: number) => {
        const { userProgress } = get();
        const safeIndex = index % puzzles.length;
        const puzzle = JSON.parse(JSON.stringify(puzzles[safeIndex]));

        console.log('[DEBUG] Store loadPuzzleByIndex:', {
          fromIndex: userProgress.currentPuzzleIndex,
          toIndex: safeIndex,
          puzzleId: puzzle.id,
          title: puzzle.title
        });

        set({
          userProgress: {
            ...userProgress,
            currentPuzzleIndex: safeIndex
          },
          currentPuzzle: puzzle,
          currentSectionIndex: 0,
          isComplete: false,
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

        console.log('[DEBUG] Store loadNextPuzzle:', {
          fromIndex: userProgress.currentPuzzleIndex,
          toIndex: randomIndex,
          puzzleId: nextPuzzle.id,
          title: nextPuzzle.title
        });

        set({
          currentPuzzle: nextPuzzle,
          currentSectionIndex: 0,
          isComplete: false,
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
        } else {
          newElo = developerSettings.customElo;
        }

        // Update user progress
        const updatedProgress = {
          ...userProgress,
          elo: newElo
        };

        if (isSuccess) {
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
          set({
            userProgress: updatedProgress,
            hasFailedCurrentPuzzle: true
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
          hasFailedCurrentPuzzle: false
        });
      },

      resetAllProgress: () => {
        set({
          userProgress: initialUserProgress,
          currentPuzzle: null,
          currentSectionIndex: 0,
          isComplete: false,
          hasFailedCurrentPuzzle: false
        });
        get().loadPuzzle();
      },

      toggleDeveloperMode: () => {
        const { isDeveloperMode } = get();
        set({ isDeveloperMode: !isDeveloperMode });
        console.log('[DEBUG] Developer mode:', !isDeveloperMode);
      },

      updateDeveloperSettings: (settings) => {
        const { developerSettings, userProgress } = get();

        set({
          developerSettings: {
            ...developerSettings,
            ...settings
          }
        });

        // If customElo is set, immediately update the user's ELO
        if (settings.customElo !== undefined) {
          set({
            userProgress: {
              ...userProgress,
              elo: settings.customElo ?? userProgress.elo
            }
          });
        }

        console.log('[DEBUG] Updated developer settings:', {
          ...developerSettings,
          ...settings
        });
      }
    }),
    {
      name: 'code-puzzle-storage',
      migrate: migratePuzzles
    }
  )
);

export default usePuzzleStore; 