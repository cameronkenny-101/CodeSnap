import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { CodeBlock as CodeBlockType, CodeSlot as CodeSlotType } from '../utils/puzzles';
import { useTheme } from '../context/ThemeContext';

interface CodeSlotProps {
  slot: CodeSlotType;
  onBlockDrop: (blockId: string, slotId: string) => void;
  onReset: (slotId: string, blockId: string | null) => void;
  filledBlock?: CodeBlockType;
  isIncorrect?: boolean;
  onSlotClick?: (slotId: string) => void;
  
}

const CodeSlot = ({ slot, onBlockDrop, onReset, filledBlock, isIncorrect, onSlotClick }: CodeSlotProps) => {
  const { isDarkMode } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  
  // Set up drag and drop functionality
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'codeBlock',
    drop: (item: { id: string }) => {
      onBlockDrop(item.id, slot.id);
    },
    canDrop: () => slot.filledWithBlockId === null, // Only accept if slot is empty
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });
  
  // Connect the drop ref
  drop(ref);
  
  // Handle reset of filled block
  const handleReset = () => {
    if (slot.filledWithBlockId) {
      onReset(slot.id, slot.filledWithBlockId);
    }
  };

  // Handle slot click
  const handleClick = () => {
    if (slot.filledWithBlockId) {
      handleReset();
    } else if (onSlotClick) {
      onSlotClick(slot.id);
    }
  };
  
  // Get background color based on slot state
  const getBackgroundColor = () => {
    if (slot.isSolved) {
      return isDarkMode ? 'bg-green-800/20' : 'bg-green-100';
    }
    if (isIncorrect) {
      return isDarkMode ? 'bg-red-800/20' : 'bg-red-100';
    }
    if (isOver && canDrop) {
      return isDarkMode ? 'bg-blue-800/50' : 'bg-blue-100';
    }
    return isDarkMode ? 'bg-gray-800' : 'bg-gray-100';
  };
  
  // Get border color based on slot state
  const getBorderColor = () => {
    if (slot.isSolved) {
      return isDarkMode ? 'border-green-600' : 'border-green-400';
    }
    if (isIncorrect) {
      return isDarkMode ? 'border-red-600' : 'border-red-400';
    }
    if (isOver && canDrop) {
      return isDarkMode ? 'border-blue-400' : 'border-blue-400';
    }
    if (slot.filledWithBlockId) {
      return isDarkMode ? 'border-gray-500' : 'border-gray-300';
    }
    return isDarkMode ? 'border-gray-600/30' : 'border-gray-300';
  };

  // Fixed size that doesn't change
  const slotStyle = {
    minWidth: '150px',
    minHeight: '32px',
    padding: '4px 8px',
    fontFamily: 'monospace',
  };
  
  // Empty slot content
  const emptyContent = (
    <span className="text-gray-400 dark:text-gray-500 text-xs italic">
      ... code ...
    </span>
  );
  
  // Filled slot content
  const filledContent = filledBlock ? (
    <span className="text-xs font-mono font-medium">
      {filledBlock.content}
    </span>
  ) : null;

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={`
        relative rounded-md border ${getBorderColor()} ${getBackgroundColor()} 
        transition-all duration-200 cursor-pointer 
        mx-1 my-0.5 shadow-sm hover:shadow-md
        ${isIncorrect ? 'shake' : ''}
      `}
      style={slotStyle}
    >
      {slot.filledWithBlockId ? filledContent : emptyContent}
    </div>
  );
};

export default CodeSlot; 