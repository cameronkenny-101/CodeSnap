import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CodeBlock from './CodeBlock';
import CodeSlot from './CodeSlot';
import usePuzzleStore from '../store/usePuzzles';
import { Puzzle as PuzzleType, CodeBlock as CodeBlockType } from '../utils/puzzles';
import { useTheme } from '../context/ThemeContext';

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
    finishPuzzle,
    resetCurrentPuzzle: resetPuzzleStore,
  } = usePuzzleStore();
  
  const [slots, setSlots] = useState(puzzle.sections[puzzle.currentSectionIndex].slots);
  const [blocks, setBlocks] = useState<CodeBlockType[]>([]);
  const [allSlotsFilled, setAllSlotsFilled] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(puzzle.currentSectionIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{type: 'success' | 'error' | 'none', message: string}>({
    type: 'none',
    message: ''
  });
  
  // Initialize puzzle state
  const initializePuzzleState = () => {
    setCurrentSectionIndex(puzzle.currentSectionIndex);
    setSlots(puzzle.sections[puzzle.currentSectionIndex].slots);
    
    // Initialize blocks with shuffle
    const sectionBlocks = [...puzzle.sections[puzzle.currentSectionIndex].blocks];
    shuffleArray(sectionBlocks);
    setBlocks(sectionBlocks);
    
    // Ensure all slots are reset
    setAllSlotsFilled(false);
    setIsTransitioning(false);
    setFeedbackMessage({type: 'none', message: ''});
  };
  
  useEffect(() => {
    // When the puzzle changes, reset the state
    initializePuzzleState();
  }, [puzzle]);

  useEffect(() => {
    // Update when section changes
    if (currentSectionIndex !== puzzle.currentSectionIndex) {
      setSlots(puzzle.sections[currentSectionIndex].slots);
      
      // Initialize blocks with shuffle
      const sectionBlocks = [...puzzle.sections[currentSectionIndex].blocks];
      shuffleArray(sectionBlocks);
      setBlocks(sectionBlocks);
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

  // Handle reset button click
  const handleReset = () => {
    if (isTransitioning) return;
    
    // Reset store state if needed
    resetPuzzleStore();
    
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
    setFeedbackMessage({type: 'none', message: ''});
  };

  // Guaranteed next puzzle transition
  const immediatelyGoToNextPuzzle = () => {
    // Update ELO and progress first
    finishPuzzle(false);
    
    // Then load next puzzle
    loadNextPuzzle();
    
    // Force re-initialization of puzzle state on next render cycle
    requestAnimationFrame(() => {
      initializePuzzleState();
      
      // Transition completed
      setIsTransitioning(false);
      
      // Clear any feedback
      setFeedbackMessage({type: 'none', message: ''});
    });
  };

  const checkSolution = () => {
    if (isTransitioning) return; // Prevent multiple clicks during transition
    
    // Check if all slots have the correct blocks
    const isCorrect = slots.every(slot => 
      slot.filledWithBlockId === slot.correctBlockId
    );

    if (isCorrect) {
      // Show success feedback
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
      
      setIsTransitioning(true);
      
      // If there are more sections, move to the next one
      if (currentSectionIndex < puzzle.sections.length - 1) {
        const nextSectionIndex = currentSectionIndex + 1;
        
        // Move to next section after a short delay
        setTimeout(() => {
          setCurrentSectionIndex(nextSectionIndex);
          setIsTransitioning(false);
          setFeedbackMessage({type: 'none', message: ''});
        }, 800);
      } else {
        // This was the last section, puzzle is complete
        setTimeout(() => {
          onPuzzleComplete();
          finishPuzzle(true);
          setIsTransitioning(false);
          setFeedbackMessage({type: 'none', message: ''});
        }, 800);
      }
    } else {
      // Show error feedback
      setFeedbackMessage({
        type: 'error',
        message: 'That\'s not quite right. Moving to next puzzle...'
      });
      
      // Call incorrect answer handler
      onIncorrectAnswer();
      
      // Mark slots as incorrect but go to next puzzle after a short delay
      setIsTransitioning(true);
      
      // Mark incorrect slots
      setSlots(prevSlots => 
        prevSlots.map(slot => ({
          ...slot,
          isIncorrect: slot.filledWithBlockId !== slot.correctBlockId && slot.filledWithBlockId !== null
        }))
      );
      
      // Wait a moment to show the red highlight before transitioning
      setTimeout(() => {
        immediatelyGoToNextPuzzle();
      }, 1500);
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
              />
            </span>
          );
        }
      }
      
      // Return regular code with proper formatting and line breaks
      return (
        <span key={index} className="whitespace-pre">
          {part}
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
  
  // Feedback message styling
  const getFeedbackStyle = () => {
    if (feedbackMessage.type === 'success') {
      return isDarkMode 
        ? 'bg-green-900/20 text-green-300 border-green-700' 
        : 'bg-green-50 text-green-700 border-green-200';
    } else if (feedbackMessage.type === 'error') {
      return isDarkMode 
        ? 'bg-red-900/20 text-red-300 border-red-700' 
        : 'bg-red-50 text-red-700 border-red-200';
    }
    return 'hidden';
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="leetcode-container pb-4 px-4 md:px-0">
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
        
        {/* Feedback message */}
        {feedbackMessage.type !== 'none' && (
          <div className={`mb-4 px-4 py-3 rounded-md border text-center ${getFeedbackStyle()} transition-all duration-300`}>
            {feedbackMessage.message}
          </div>
        )}
        
        <div className="editor-container mb-4 rounded-lg overflow-hidden shadow-md">
          <div className="editor-header flex justify-between items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600 dark:text-gray-400">{currentSection.title}</span>
              <div className="flex space-x-1">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div className="text-xs text-gray-500">JavaScript</div>
          </div>
          
          <div className="editor-description px-4 py-2 bg-gray-50 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
            {currentSection.description}
          </div>
          
          <div className={`editor-content p-4 font-mono text-sm overflow-x-auto ${
            isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
          }`}>
            <div className="code-area flex justify-center">
              <pre className="text-center">
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
            disabled={!allSlotsFilled || isTransitioning}
            className={`px-4 py-1.5 rounded-md font-medium text-sm transition-all ${
              !allSlotsFilled || isTransitioning
                ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-sm'
            }`}
          >
            Submit
          </button>
          
          <button
            onClick={handleReset}
            disabled={isTransitioning}
            className={`px-4 py-1.5 rounded-md font-medium text-sm transition-all ${
              isTransitioning
                ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 shadow-sm'
            }`}
          >
            Reset
          </button>
        </div>
      </div>
    </DndProvider>
  );
};

export default Puzzle; 