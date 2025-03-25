import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { CodeBlock as CodeBlockType } from '../utils/puzzles';
import { useTheme } from '../context/ThemeContext';

interface CodeBlockProps {
  block: CodeBlockType;
  isDraggable?: boolean;
  onBlockClick?: (blockId: string) => void;
}

const CodeBlock = ({ block, isDraggable = true, onBlockClick }: CodeBlockProps) => {
  const { isDarkMode } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  
  // Set up drag and drop functionality
  const [{ isDragging }, drag] = useDrag({
    type: 'codeBlock',
    item: { id: block.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: () => isDraggable,
  });
  
  // Connect the drag ref
  drag(ref);
  
  // Handle click to move block
  const handleClick = () => {
    if (isDraggable && onBlockClick) {
      onBlockClick(block.id);
    }
  };
  
  // Standard block style
  const blockStyle = {
    minWidth: '150px',
    minHeight: '32px',
    padding: '4px 8px',
    fontFamily: 'monospace',
    opacity: isDragging ? 0.4 : 1
  };

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={`
        rounded-md border m-1 cursor-pointer
        ${isDarkMode 
          ? 'bg-blue-800/20 border-blue-700 text-blue-200 hover:bg-blue-800/30' 
          : 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100'
        }
        shadow-sm
        transition-all duration-200
      `}
      style={blockStyle}
    >
      <span className="text-xs font-mono">
        {block.content}
      </span>
    </div>
  );
};

export default CodeBlock; 