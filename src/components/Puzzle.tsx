import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CodeBlock from './CodeBlock';
import CodeSlot from './CodeSlot';
import usePuzzleStore from '../store/usePuzzles';
import { Puzzle as PuzzleType, CodeBlock as CodeBlockType } from '../utils/puzzles';
import { useTheme } from '../context/ThemeContext';
import { playErrorSound, playSuccessSound } from '../utils/audio';

interface PuzzleProps {
  puzzle: PuzzleType;
  onPuzzleComplete: () => void;
  onCorrectAnswer: () => void;
  onIncorrectAnswer: () => void;
}

const Puzzle = ({ puzzle, onPuzzleComplete, onCorrectAnswer, onIncorrectAnswer }: PuzzleProps) => {
  const { isDarkMode } = useTheme();
  const {
    loadNextPuzzle,
    completeEntirePuzzle,
    developerSettings
  } = usePuzzleStore();

  const [slots, setSlots] = useState(puzzle.sections[puzzle.currentSectionIndex].slots);
  const [blocks, setBlocks] = useState<CodeBlockType[]>([]);
  const [allSlotsFilled, setAllSlotsFilled] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(puzzle.currentSectionIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error' | 'none', message: string }>({
    type: 'none',
    message: ''
  });
  const [showRetryOptions, setShowRetryOptions] = useState(false);
  const [showErrorAnimation, setShowErrorAnimation] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [isExitingPopup, setIsExitingPopup] = useState(false);

  // Initialize puzzle state
  const initializePuzzleState = () => {
    if (!puzzle) return;

    console.log('[DEBUG] Initializing puzzle state for:', puzzle.id);

    setCurrentSectionIndex(puzzle.currentSectionIndex);

    // Deep copy the slots to prevent reference issues
    const freshSlots = JSON.parse(JSON.stringify(puzzle.sections[puzzle.currentSectionIndex].slots));
    setSlots(freshSlots);

    // Deep copy and initialize blocks with shuffle
    const freshBlocks = JSON.parse(JSON.stringify(puzzle.sections[puzzle.currentSectionIndex].blocks));
    shuffleArray(freshBlocks);
    setBlocks(freshBlocks);

    // Reset all states
    setAllSlotsFilled(false);
    setIsTransitioning(false);
    setShowRetryOptions(false);
    setShowErrorAnimation(false);
    setFeedbackMessage({ type: 'none', message: '' });

    console.log('[DEBUG] Initialized with blocks:', freshBlocks.map((block: CodeBlockType) => block.id));
  };

  useEffect(() => {
    // When the puzzle changes, reset the state
    console.log('[DEBUG] Puzzle changed:', {
      puzzleId: puzzle?.id,
      title: puzzle?.title,
      sections: puzzle?.sections?.length,
      currentSection: puzzle?.currentSectionIndex
    });
    // Completely reset all state before initializing
    setBlocks([]);
    setSlots([]);
    setAllSlotsFilled(false);
    setIsTransitioning(false);
    setShowRetryOptions(false);
    setShowErrorAnimation(false);
    setFeedbackMessage({ type: 'none', message: '' });

    // Now initialize with fresh state
    setTimeout(() => {
      initializePuzzleState();
    }, 0);
  }, [puzzle]);

  useEffect(() => {
    // For debugging - track section changes
    console.log('[DEBUG] Section state updated:', {
      puzzleId: puzzle?.id,
      title: puzzle?.title,
      currentSectionIndex,
      totalSections: puzzle?.sections?.length,
      sectionTitle: puzzle?.sections[currentSectionIndex]?.title
    });
  }, [currentSectionIndex, puzzle]);

  useEffect(() => {
    // Update when section changes
    if (currentSectionIndex !== puzzle.currentSectionIndex) {
      console.log('[DEBUG] Section changed:', {
        from: puzzle.currentSectionIndex,
        to: currentSectionIndex
      });

      // Reset any lingering state first
      setIsTransitioning(false);
      setShowRetryOptions(false);
      setShowErrorAnimation(false);
      setFeedbackMessage({ type: 'none', message: '' });

      // Deep copy the slots to prevent reference issues
      const freshSlots = JSON.parse(JSON.stringify(puzzle.sections[currentSectionIndex].slots));
      setSlots(freshSlots);

      // Deep copy and initialize blocks with shuffle
      const freshBlocks = JSON.parse(JSON.stringify(puzzle.sections[currentSectionIndex].blocks));
      shuffleArray(freshBlocks);
      setBlocks(freshBlocks);

      console.log('[DEBUG] Section initialized with blocks:', freshBlocks.map((b: CodeBlockType) => b.id));
    }
  }, [currentSectionIndex, puzzle]);

  // Check if all slots are filled
  useEffect(() => {
    const allFilled = slots.every(slot => slot.filledWithBlockId !== null);
    setAllSlotsFilled(allFilled);
  }, [slots]);

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const handleBlockDrop = (blockId: string, slotId: string) => {
    // Update slots state
    setSlots(prevSlots =>
      prevSlots.map(slot =>
        slot.id === slotId
          ? { ...slot, filledWithBlockId: blockId }
          : slot
      )
    );

    // Remove block from available blocks
    setBlocks(prevBlocks =>
      prevBlocks.filter(block => block.id !== blockId)
    );
  };

  const handleSlotReset = (slotId: string, blockId: string | null) => {
    if (!blockId) return;

    // Update slots state
    setSlots(prevSlots =>
      prevSlots.map(slot =>
        slot.id === slotId
          ? { ...slot, filledWithBlockId: null, isIncorrect: false }
          : slot
      )
    );

    // Add block back to available blocks
    const blockToReturn = puzzle.sections[currentSectionIndex].blocks.find(block => block.id === blockId);
    if (blockToReturn) {
      setBlocks(prevBlocks => [...prevBlocks, blockToReturn]);
    }
  };

  // Handle block click to move to first empty slot
  const handleBlockClick = (blockId: string) => {
    // Find first empty slot
    const emptySlot = slots.find(slot => slot.filledWithBlockId === null);
    if (emptySlot) {
      handleBlockDrop(blockId, emptySlot.id);
    }
  };

  // Handle slot click to move block back
  const handleSlotClick = (slotId: string) => {
    const slot = slots.find(s => s.id === slotId);
    if (slot && slot.filledWithBlockId) {
      handleSlotReset(slotId, slot.filledWithBlockId);
    }
  };

  // Handle reset button click
  const handleReset = () => {
    // Reset all slots to empty
    setSlots(prevSlots =>
      prevSlots.map(slot => ({
        ...slot,
        filledWithBlockId: null,
        isSolved: false,
        isIncorrect: false
      }))
    );

    // Reset blocks to original state with shuffle
    const sectionBlocks = [...puzzle.sections[currentSectionIndex].blocks];
    shuffleArray(sectionBlocks);
    setBlocks(sectionBlocks);

    // Clear any feedback message
    setFeedbackMessage({ type: 'none', message: '' });

    // Ensure transitioning state is reset
    setIsTransitioning(false);
  };

  const handleRetry = () => {
    console.log('[DEBUG] handleRetry called');

    // First show exit animation
    setIsExitingPopup(true);

    // Then reset after animation completes
    setTimeout(() => {
      setShowRetryOptions(false);
      setIsTransitioning(false);
      setShowErrorAnimation(false);
      setFeedbackMessage({ type: 'none', message: '' });
      setIsExitingPopup(false);

      // Then reset the slots and blocks
      handleReset();
    }, 200); // Match animation duration

    console.log('[DEBUG] After handleRetry - isTransitioning:', false);
  };

  const handleMoveToNext = () => {
    console.log('[DEBUG] handleMoveToNext called');

    // First show exit animation
    setIsExitingPopup(true);

    // Then reset after animation completes
    setTimeout(() => {
      setShowRetryOptions(false);
      setIsTransitioning(false);
      setFeedbackMessage({ type: 'none', message: '' });
      setIsExitingPopup(false);

      // Load next puzzle
      loadNextPuzzle();
    }, 200); // Match animation duration
  };

  const checkSolution = () => {
    if (!currentSection) return;

    // Log the current state of slots for debugging
    console.log('[DEBUG] Checking solution for section:', currentSection.title);
    slots.forEach((slot, index) => {
      console.log(`[DEBUG] Slot ${index}:`, {
        id: slot.id,
        filledWithBlockId: slot.filledWithBlockId,
        correctBlockId: slot.correctBlockId,
        isCorrect: slot.filledWithBlockId === slot.correctBlockId
      });
    });

    // Check if developer mode is enabled
    console.log('[DEBUG] Developer settings:', developerSettings);

    // If force correct is enabled, skip the actual check
    const isCorrect = developerSettings.forceCorrect ? true :
      slots.every((slot) => {
        const isSlotCorrect = slot.filledWithBlockId === slot.correctBlockId;
        console.log(`[DEBUG] Checking slot ${slot.id}: filled=${slot.filledWithBlockId}, correct=${slot.correctBlockId}, match=${isSlotCorrect}`);
        return isSlotCorrect;
      });

    console.log('[DEBUG] Overall solution correct:', isCorrect);

    if (isCorrect) {
      setIsTransitioning(true);
      playSuccessSound();

      setFeedbackMessage({
        type: 'success',
        message: 'Great job! That\'s correct.'
      });

      // Mark slots as solved
      setSlots(prevSlots =>
        prevSlots.map(slot => ({ ...slot, isSolved: true }))
      );

      // Call correct answer handler
      onCorrectAnswer();

      // If there are more sections, move to the next one
      if (currentSectionIndex < puzzle.sections.length - 1) {
        const nextSectionIndex = currentSectionIndex + 1;
        console.log('[DEBUG] Scheduling move to next section after correct answer', { nextSectionIndex });

        // Move to next section after a short delay
        setTimeout(() => {
          console.log('[DEBUG] Moving to next section now');
          setCurrentSectionIndex(nextSectionIndex);
          setIsTransitioning(false);
          setFeedbackMessage({ type: 'none', message: '' });
        }, 1000);
      } else {
        // This was the last section, puzzle is complete
        console.log('[DEBUG] Scheduling puzzle completion (success)');
        setIsLoadingNext(true);
        setTimeout(() => {
          console.log('[DEBUG] Completing puzzle now');
          onPuzzleComplete();
          completeEntirePuzzle(true);

          // Use a separate timer to allow state to update properly
          setTimeout(() => {
            // Reset transition states to prepare for the next puzzle
            setIsTransitioning(false);
            setFeedbackMessage({ type: 'none', message: '' });
            setIsLoadingNext(false);

            // Load the next puzzle
            loadNextPuzzle();
            console.log('[DEBUG] Next puzzle loaded');
          }, 500);
        }, 1200);
      }
    } else {
      // Mark incorrect slots and show error message
      setSlots(prevSlots =>
        prevSlots.map(slot => ({
          ...slot,
          isIncorrect: slot.filledWithBlockId !== slot.correctBlockId && slot.filledWithBlockId !== null
        }))
      );

      // Show error message
      setFeedbackMessage({
        type: 'error',
        message: "Incorrect! Would you like to try the step again?"
      });

      // Play error sound effect
      playErrorSound();

      // Trigger error animation
      setShowErrorAnimation(true);
      setTimeout(() => setShowErrorAnimation(false), 700);

      // Show retry options
      setShowRetryOptions(true);
      console.log('[DEBUG] Set showRetryOptions:', true);

      // Call incorrect answer handler and mark puzzle as failed
      onIncorrectAnswer();
      completeEntirePuzzle(false);

      // Set transitioning state to prevent further submissions until user chooses an option
      setIsTransitioning(true);
      console.log('[DEBUG] Set isTransitioning:', true);
    }
  };

  const renderCodeTemplate = (template: string) => {
    // Replace slot placeholders with actual slot components
    const parts = template.split(/(%SLOT-\d+%)/g);

    return parts.map((part, index) => {
      const match = part.match(/%SLOT-(\d+)%/);
      if (match) {
        const slotNumber = match[1];
        const slot = slots.find(s => s.id === `slot-${slotNumber}`);

        if (slot) {
          return (
            <span key={index} className="inline-block">
              <CodeSlot
                slot={slot}
                onBlockDrop={handleBlockDrop}
                onReset={handleSlotReset}
                filledBlock={slot.filledWithBlockId
                  ? puzzle.sections[currentSectionIndex].blocks.find(b => b.id === slot.filledWithBlockId)
                  : undefined
                }
                isIncorrect={slot.isIncorrect}
                onSlotClick={handleSlotClick}
              />
            </span>
          );
        }
      }

      // Process the code text for syntax highlighting
      return (
        <span key={index} className="whitespace-pre">
          {syntaxHighlight(part)}
        </span>
      );
    });
  };

  // Function to apply syntax highlighting by returning React elements
  const syntaxHighlight = (code: string) => {
    // Split the code into parts to highlight
    const tokens: Array<{ type: string, value: string }> = [];

    // Process the code to identify different token types
    let remaining = code;
    while (remaining.length > 0) {
      // Check for keywords
      const keywordMatch = remaining.match(/^\b(function|return|const|let|var|if|else|for|while|do|switch|case|break|continue|new|this|typeof|instanceof)\b/);
      if (keywordMatch) {
        tokens.push({ type: 'keyword', value: keywordMatch[0] });
        remaining = remaining.substring(keywordMatch[0].length);
        continue;
      }

      // Check for numbers
      const numberMatch = remaining.match(/^\b\d+\b/);
      if (numberMatch) {
        tokens.push({ type: 'number', value: numberMatch[0] });
        remaining = remaining.substring(numberMatch[0].length);
        continue;
      }

      // Check for function calls
      const functionMatch = remaining.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/);
      if (functionMatch) {
        tokens.push({ type: 'function', value: functionMatch[1] });
        tokens.push({ type: 'plain', value: '(' });
        remaining = remaining.substring(functionMatch[0].length);
        continue;
      }

      // Check for property access
      const propertyMatch = remaining.match(/^\.([a-zA-Z_$][a-zA-Z0-9_$]*)/);
      if (propertyMatch) {
        tokens.push({ type: 'plain', value: '.' });
        tokens.push({ type: 'property', value: propertyMatch[1] });
        remaining = remaining.substring(propertyMatch[0].length);
        continue;
      }

      // Check for parameters and variables
      const paramMatch = remaining.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)/);
      if (paramMatch) {
        tokens.push({ type: 'variable', value: paramMatch[0] });
        remaining = remaining.substring(paramMatch[0].length);
        continue;
      }

      // Check for operators
      const operatorMatch = remaining.match(/^([+\-*/%=&|^<>!]+)/);
      if (operatorMatch) {
        tokens.push({ type: 'operator', value: operatorMatch[0] });
        remaining = remaining.substring(operatorMatch[0].length);
        continue;
      }

      // Check for parentheses and brackets
      const bracketMatch = remaining.match(/^[\(\)\[\]\{\}]/);
      if (bracketMatch) {
        tokens.push({ type: 'bracket', value: bracketMatch[0] });
        remaining = remaining.substring(bracketMatch[0].length);
        continue;
      }

      // Check for strings
      const stringMatch = remaining.match(/^"([^"]*)"/) || remaining.match(/^'([^']*)'/);
      if (stringMatch) {
        tokens.push({ type: 'string', value: stringMatch[0] });
        remaining = remaining.substring(stringMatch[0].length);
        continue;
      }

      // Check for comments
      const commentMatch = remaining.match(/^\/\/(.*?)(?:\n|$)/);
      if (commentMatch) {
        tokens.push({ type: 'comment', value: commentMatch[0] });
        remaining = remaining.substring(commentMatch[0].length);
        continue;
      }

      // If no matches, take the next character as plain text
      tokens.push({ type: 'plain', value: remaining[0] });
      remaining = remaining.substring(1);
    }

    // Convert tokens to React elements
    return tokens.map((token, i) => {
      if (token.type === 'plain') {
        return token.value;
      }
      return (
        <span key={i} className={`js-${token.type}`}>
          {token.value}
        </span>
      );
    });
  };

  // Determine difficulty level based on puzzle difficulty
  const getDifficultyClass = (difficulty: number) => {
    if (difficulty <= 2) return "text-green-500 bg-green-50 dark:bg-green-900/20";
    if (difficulty <= 4) return "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
    return "text-red-500 bg-red-50 dark:bg-red-900/20";
  };

  const getDifficultyText = (difficulty: number) => {
    if (difficulty <= 2) return "Easy";
    if (difficulty <= 4) return "Medium";
    return "Hard";
  };

  // Get current section
  const currentSection = puzzle.sections[currentSectionIndex];

  // Check if submit button should be disabled
  const isSubmitDisabled = !allSlotsFilled || isTransitioning;

  // For debugging
  useEffect(() => {
    console.log('[DEBUG] Submit button state:', {
      allSlotsFilled,
      isTransitioning,
      showRetryOptions,
      isDisabled: isSubmitDisabled
    });
  }, [allSlotsFilled, isTransitioning, showRetryOptions]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`puzzle-container relative p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
        <div className="mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="problem-title text-xl font-bold">{puzzle.title}</h2>
            <span className={`problem-difficulty px-2 py-1 rounded-full text-xs font-medium ${getDifficultyClass(puzzle.difficulty)}`}>
              {getDifficultyText(puzzle.difficulty)}
            </span>
            <span className="ml-auto text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
              Part {currentSectionIndex + 1}/{puzzle.sections.length}
            </span>
          </div>
          <p className="problem-description text-sm text-gray-600 dark:text-gray-300 mt-2">{puzzle.description}</p>
        </div>

        <div className="editor-container mb-4 rounded-lg overflow-hidden shadow-md">
          <div className="editor-header flex justify-between items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                Step {currentSectionIndex + 1} of {puzzle.sections.length}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentSection.title}
              </span>
            </div>
            <div className="text-xs text-gray-500">JavaScript</div>
          </div>

          <div className="editor-description px-4 py-2 bg-gray-50 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
            {currentSection.description}
          </div>

          <div className={`editor-content p-4 font-mono text-sm overflow-x-auto ${isDarkMode ? 'bg-gray-900 text-gray-100 dark-mode' : 'bg-white text-gray-900'
            } ${showErrorAnimation ? 'red-flash' : ''}`}>
            <div className={`code-area ${isDarkMode ? 'dark-mode' : ''}`}>
              <pre className="text-left">
                {renderCodeTemplate(currentSection.codeTemplate)}
              </pre>
            </div>
          </div>
        </div>

        <div className="available-blocks-container mb-4">
          <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
            <span>Available Code Blocks</span>
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({blocks.length} remaining)</span>
          </h3>
          <div className="block-container flex justify-center flex-wrap" style={{
            minHeight: '60px',
            maxHeight: '120px',
            overflowY: 'auto',
            padding: '4px'
          }}>
            {blocks.map(block => (
              <CodeBlock
                key={block.id}
                block={block}
                isDraggable={!isTransitioning}
                onBlockClick={handleBlockClick}
              />
            ))}
            {blocks.length === 0 && (
              <div className="w-full text-center py-3 text-sm text-gray-500 dark:text-gray-400 italic">
                All blocks have been used
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={checkSolution}
            disabled={isSubmitDisabled}
            className={`px-4 py-1.5 rounded-md font-medium text-sm transition-all ${isSubmitDisabled
              ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-sm'
              }`}
          >
            Submit
          </button>
          <button
            onClick={handleReset}
            disabled={isTransitioning && !showRetryOptions}
            className={`px-4 py-1.5 rounded-md font-medium text-sm transition-all ${isTransitioning && !showRetryOptions
              ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 shadow-sm'
              }`}
          >
            Reset
          </button>

        </div>
      </div>
      {/* Feedback message */}
      {feedbackMessage.type !== 'none' && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className={`popup-animate max-w-md w-full mx-4 p-6 rounded-lg border shadow-lg ${isExitingPopup ? 'popup-exit' : ''
            } ${feedbackMessage.type === 'success'
              ? isDarkMode
                ? 'bg-gray-800 text-green-300 border-green-700'
                : 'bg-white text-green-700 border-green-200'
              : isDarkMode
                ? 'bg-gray-800 text-red-300 border-red-700'
                : 'bg-white text-red-700 border-red-200'
            }`}>
            <div className="text-center text-lg mb-4">
              {feedbackMessage.message}
              {isLoadingNext && !showRetryOptions && (
                <div className="mt-2">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-t-transparent border-current"></div>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-3">
              {showRetryOptions && (
                <>
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 text-sm font-medium rounded-md bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>

                  <button
                    onClick={handleMoveToNext}
                    className="px-4 py-2 text-sm font-medium rounded-md bg-gray-500 text-white hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
                  >
                    Next Puzzle
                  </button>
                </>)}
            </div>
          </div>
        </div>
      )}
    </DndProvider >
  );
};

export default Puzzle; 