import * as React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { isTouchDevice } from './utils/isTouchDevice'
import './App.css'
import Puzzle from './components/Puzzle'
import usePuzzleStore from './store/usePuzzles'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import DeveloperPanel from './components/DeveloperPanel'
import { puzzles } from './utils/puzzles'

// Determine which backend to use based on device type
const backendOptions = {
  enableMouseEvents: true,
  enableTouchEvents: true,
  touchSlop: 20, // Pixels a touch can move before it's no longer considered a tap
}
const dndBackend = isTouchDevice() ? TouchBackend : HTML5Backend

function AppContent() {
  const { isDarkMode, toggleTheme } = useTheme()
  const puzzleStore = usePuzzleStore()
  const [showPuzzleList, setShowPuzzleList] = React.useState(false)

  // Initialize puzzle on first load
  React.useEffect(() => {
    // Log puzzle information for debugging
    console.log("App init - Total puzzles available:", puzzles.length);
    console.log("App init - All puzzle titles:", puzzles.map(p => p.title));

    if (!puzzleStore.currentPuzzle) {
      puzzleStore.loadPuzzle()
    }
  }, [])

  // Handle correct answer
  const handleCorrectAnswer = () => {
    console.log('[DEBUG] App handleCorrectAnswer called');
    // Don't finish the puzzle on every correct answer
    // Only increase ELO or track stats if needed
  }

  // Handle incorrect answer
  const handleIncorrectAnswer = () => {
    console.log('[DEBUG] App handleIncorrectAnswer called');
    // Don't automatically move to next puzzle
    // The user will decide whether to retry or move on
  }

  // Handle puzzle completion
  const handlePuzzleComplete = () => {
    // This is now handled in the store's finishPuzzle
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <header className={`sticky top-0 z-10 py-3 px-4 md:px-6 ${isDarkMode ? 'bg-gray-800 shadow-lg shadow-black/20' : 'bg-white shadow-md'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-lg md:text-xl font-bold">CodeSnap</h1>
            <div className="ml-3 px-2 py-1 rounded-full text-xs md:text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              ELO: {puzzleStore.userProgress.elo}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPuzzleList(!showPuzzleList)}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-blue-400' : 'bg-gray-200 text-blue-700'}`}
              aria-label="Show all puzzles"
            >
              📋
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </header>

      {/* Puzzle List Modal */}
      {showPuzzleList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={() => setShowPuzzleList(false)}>
          <div
            className={`w-full max-w-md max-h-[80vh] overflow-y-auto rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 shadow-xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">All Puzzles</h2>
              <button
                onClick={() => setShowPuzzleList(false)}
                className="text-lg"
              >
                ✕
              </button>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {puzzles.map((puzzle, index) => (
                <div
                  key={puzzle.id}
                  className={`py-3 px-2 ${index === puzzleStore.userProgress.currentPuzzleIndex ? 'bg-blue-50 dark:bg-blue-900/30 rounded' : ''}`}
                  onClick={() => {
                    puzzleStore.loadPuzzleByIndex(index);
                    setShowPuzzleList(false);
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{puzzle.title}</span>
                    <span className="text-sm">
                      {Array(puzzle.difficulty).fill('⭐').join('')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{puzzle.description}</p>
                  {puzzleStore.userProgress.solvedPuzzles.includes(puzzle.id) && (
                    <span className="text-xs text-green-600 dark:text-green-400 mt-1 inline-block">
                      ✓ Solved
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-2 sm:px-4 py-4 md:py-6 flex-grow">
        <DndProvider backend={dndBackend} options={backendOptions}>
          {puzzleStore.currentPuzzle && (
            <Puzzle
              puzzle={puzzleStore.currentPuzzle}
              onPuzzleComplete={handlePuzzleComplete}
              onCorrectAnswer={handleCorrectAnswer}
              onIncorrectAnswer={handleIncorrectAnswer}
            />
          )}
        </DndProvider>
      </main>

      {puzzleStore.isDeveloperMode && <DeveloperPanel />}

      <footer className={`py-3 mt-auto ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'}`}>
        <div className="container mx-auto px-4 text-center text-xs">
          &copy; {new Date().getFullYear()} CodeSnap - Learn coding through puzzles
        </div>
        <div className="text-xs opacity-50 cursor-pointer" onClick={puzzleStore.toggleDeveloperMode}>
          v1.0.0
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
