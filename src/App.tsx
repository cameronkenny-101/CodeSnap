import { useState, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { isTouchDevice } from './utils/isTouchDevice'
import Puzzle from './components/Puzzle'
import { puzzles, UserProgress, initialUserProgress } from './utils/puzzles'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import './App.css'

// Determine which backend to use based on device type
const backendOptions = {
  enableMouseEvents: true,
  enableTouchEvents: true,
  touchSlop: 20, // Pixels a touch can move before it's no longer considered a tap
}
const dndBackend = isTouchDevice() ? TouchBackend : HTML5Backend

function AppContent() {
  const { isDarkMode, toggleTheme } = useTheme()
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const savedProgress = localStorage.getItem('userProgress')
    return savedProgress ? JSON.parse(savedProgress) : initialUserProgress
  })
  
  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userProgress', JSON.stringify(userProgress))
  }, [userProgress])

  // Handle correct answer
  const handleCorrectAnswer = () => {
    // Increase ELO slightly for correct answers
    setUserProgress(prev => ({
      ...prev,
      elo: prev.elo + 5
    }))
  }

  // Handle incorrect answer
  const handleIncorrectAnswer = () => {
    // Decrease ELO for incorrect answers
    setUserProgress(prev => ({
      ...prev,
      elo: Math.max(prev.elo - 15, 0) // Prevent negative ELO
    }))
  }

  // Handle puzzle completion
  const handlePuzzleComplete = () => {
    const currentPuzzleId = puzzles[userProgress.currentPuzzleIndex].id
    
    // Add to solved puzzles if not already there
    setUserProgress(prev => {
      const solvedPuzzles = prev.solvedPuzzles.includes(currentPuzzleId)
        ? prev.solvedPuzzles
        : [...prev.solvedPuzzles, currentPuzzleId]
      
      return {
        ...prev,
        solvedPuzzles,
        // Move to next puzzle, or if this is the last one, loop back to first
        currentPuzzleIndex: (prev.currentPuzzleIndex + 1) % puzzles.length,
        // Increase ELO more significantly for completing a puzzle
        elo: prev.elo + 20
      }
    })
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <header className={`sticky top-0 z-10 py-3 px-4 md:px-6 ${isDarkMode ? 'bg-gray-800 shadow-lg shadow-black/20' : 'bg-white shadow-md'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-lg md:text-xl font-bold">CodeSnap</h1>
            <div className="ml-3 px-2 py-1 rounded-full text-xs md:text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              ELO: {userProgress.elo}
            </div>
          </div>
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>
        </div>
      </header>
      
      <main className="container mx-auto px-2 sm:px-4 py-4 md:py-6 flex-grow">
        <DndProvider backend={dndBackend} options={backendOptions}>
          <Puzzle 
            puzzle={puzzles[userProgress.currentPuzzleIndex]}
            onPuzzleComplete={handlePuzzleComplete}
            onCorrectAnswer={handleCorrectAnswer}
            onIncorrectAnswer={handleIncorrectAnswer}
          />
        </DndProvider>
      </main>
      
      <footer className={`py-3 mt-auto ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'}`}>
        <div className="container mx-auto px-4 text-center text-xs">
          &copy; {new Date().getFullYear()} CodeSnap - Learn coding through puzzles
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
