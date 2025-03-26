export interface CodeBlock {
  id: string;
  content: string;
  isCorrect: boolean;
  isDecoy?: boolean;
  slotId: string; // Which slot this block is for
}

export interface CodeSlot {
  id: string;
  correctBlockId: string;
  filledWithBlockId: string | null;
  isSolved: boolean;
  isIncorrect?: boolean;
}

export interface PuzzleSection {
  id: string;
  title: string;
  description: string;
  codeTemplate: string; // Section-specific code with placeholders
  slots: CodeSlot[];
  blocks: CodeBlock[];
  isVisible: boolean; // Whether this section is visible yet
}

export interface Puzzle {
  id: string;
  title: string;
  description: string;
  difficulty: number; // 1-5 scale, used for ELO calculation
  sections: PuzzleSection[]; // Progressive sections that become visible as you solve
  currentSectionIndex: number; // The current active section
}

export interface UserProgress {
  elo: number;
  solvedPuzzles: string[];
  currentPuzzleIndex: number;
}

// Sample puzzles with multiple parts to fill in
export const puzzles: Puzzle[] = [
  {
    id: 'binary-search',
    title: 'Binary Search Algorithm',
    description: 'Complete the binary search algorithm by filling in the missing logic. \n\nExample Input: arr = [1, 3, 5, 7, 9], target = 5 \nExample Output: 2 (index where target was found)',
    difficulty: 3,
    currentSectionIndex: 0,
    sections: [
      {
        id: 'binary-search-mid',
        title: 'Step 1: Calculate Middle Index',
        description: 'First, calculate the middle index for a binary search.',
        codeTemplate: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    let mid = %SLOT-1%;
    // To be continued...
  }
}`,
        slots: [
          {
            id: 'slot-1',
            correctBlockId: 'block-1',
            filledWithBlockId: null,
            isSolved: false
          }
        ],
        blocks: [
          {
            id: 'block-1',
            content: 'Math.floor((left + right) / 2)',
            isCorrect: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-2',
            content: 'left + right / 2',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: '(left + right) >> 2',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          }
        ],
        isVisible: true
      },
      {
        id: 'binary-search-found',
        title: 'Step 2: Check if Target is Found',
        description: 'Now, check if the current middle element matches the target.',
        codeTemplate: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (%SLOT-1%) {
      return mid;
    } 
    // To be continued...
  }
}`,
        slots: [
          {
            id: 'slot-1',
            correctBlockId: 'block-1',
            filledWithBlockId: null,
            isSolved: false
          }
        ],
        blocks: [
          {
            id: 'block-1',
            content: 'arr[mid] === target',
            isCorrect: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-2',
            content: 'arr[mid] >= target',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: 'mid === target',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          }
        ],
        isVisible: false
      },
      {
        id: 'binary-search-left',
        title: 'Step 3: Update Left Pointer',
        description: 'If the target is larger than the middle element, search the right half.',
        codeTemplate: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (%SLOT-1%) {
      left = %SLOT-2%;
    }
    // To be continued...
  }
}`,
        slots: [
          {
            id: 'slot-1',
            correctBlockId: 'block-1',
            filledWithBlockId: null,
            isSolved: false
          },
          {
            id: 'slot-2',
            correctBlockId: 'block-4',
            filledWithBlockId: null,
            isSolved: false
          }
        ],
        blocks: [
          {
            id: 'block-1',
            content: 'arr[mid] < target',
            isCorrect: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-2',
            content: 'target > arr[mid + 1]',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: 'arr[mid - 1] < target',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-4',
            content: 'mid + 1',
            isCorrect: true,
            slotId: 'slot-2'
          },
          {
            id: 'block-5',
            content: 'mid',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-2'
          },
          {
            id: 'block-6',
            content: 'left + mid',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-2'
          }
        ],
        isVisible: false
      },
      {
        id: 'binary-search-right',
        title: 'Step 4: Complete the Algorithm',
        description: 'Finish the algorithm by handling the case when the target is smaller than the middle element.',
        codeTemplate: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = %SLOT-1%;
    }
  }

  return %SLOT-2%;
}`,
        slots: [
          {
            id: 'slot-1',
            correctBlockId: 'block-1',
            filledWithBlockId: null,
            isSolved: false
          },
          {
            id: 'slot-2',
            correctBlockId: 'block-4',
            filledWithBlockId: null,
            isSolved: false
          }
        ],
        blocks: [
          {
            id: 'block-1',
            content: 'mid - 1',
            isCorrect: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-2',
            content: 'right - 1',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: 'mid / 2',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-4',
            content: '-1',
            isCorrect: true,
            slotId: 'slot-2'
          },
          {
            id: 'block-5',
            content: 'undefined',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-2'
          },
          {
            id: 'block-6',
            content: 'null',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-2'
          }
        ],
        isVisible: false
      }
    ]
  },
  {
    id: 'lcs',
    title: 'Longest Common Subsequence',
    description: 'Build a dynamic programming solution to find the longest common subsequence between two strings.',
    difficulty: 5,
    currentSectionIndex: 0,
    sections: [
      {
        id: 'lcs-initialization',
        title: 'Initialize the DP Table',
        description: 'Begin by setting up the dynamic programming table with proper dimensions.',
        codeTemplate: `function longestCommonSubsequence(text1, text2) {
  // Create DP table
  const m = text1.length;
  const n = text2.length;
  const dp = %SLOT-1%;
  
  // More code to follow...
}`,
        slots: [
          {
            id: 'slot-1',
            correctBlockId: 'block-1',
            filledWithBlockId: null,
            isSolved: false
          }
        ],
        blocks: [
          {
            id: 'block-1',
            content: 'Array(m + 1).fill().map(() => Array(n + 1).fill(0))',
            isCorrect: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-2',
            content: 'Array(m).fill().map(() => Array(n).fill(0))',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: 'new Array(m + 1, n + 1).fill(0)',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          }
        ],
        isVisible: true
      },
      {
        id: 'lcs-base-case',
        title: 'Base Cases',
        description: 'The base cases are already handled with zeros in the first row and column (empty strings).',
        codeTemplate: `function longestCommonSubsequence(text1, text2) {
  // Create DP table
  const m = text1.length;
  const n = text2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  // Fill the DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (%SLOT-1%) {
        dp[i][j] = %SLOT-2%;
      } else {
        // More code to follow...
      }
    }
  }
}`,
        slots: [
          {
            id: 'slot-1',
            correctBlockId: 'block-1',
            filledWithBlockId: null,
            isSolved: false
          },
          {
            id: 'slot-2',
            correctBlockId: 'block-4',
            filledWithBlockId: null,
            isSolved: false
          }
        ],
        blocks: [
          {
            id: 'block-1',
            content: 'text1[i - 1] === text2[j - 1]',
            isCorrect: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-2',
            content: 'text1[i] === text2[j]',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: 'text1.charAt(i) === text2.charAt(j)',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-4',
            content: 'dp[i - 1][j - 1] + 1',
            isCorrect: true,
            slotId: 'slot-2'
          },
          {
            id: 'block-5',
            content: '1 + dp[i - 1][j - 1]',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-2'
          },
          {
            id: 'block-6',
            content: 'Math.max(dp[i - 1][j - 1] + 1, dp[i - 1][j], dp[i][j - 1])',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-2'
          }
        ],
        isVisible: false
      },
      {
        id: 'lcs-recurrence',
        title: 'Recurrence Relation',
        description: 'Now implement the recurrence relation for when characters don\'t match.',
        codeTemplate: `function longestCommonSubsequence(text1, text2) {
  // Create DP table
  const m = text1.length;
  const n = text2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  // Fill the DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = %SLOT-1%;
      }
    }
  }
  
  // More code to follow...
}`,
        slots: [
          {
            id: 'slot-1',
            correctBlockId: 'block-1',
            filledWithBlockId: null,
            isSolved: false
          }
        ],
        blocks: [
          {
            id: 'block-1',
            content: 'Math.max(dp[i - 1][j], dp[i][j - 1])',
            isCorrect: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-2',
            content: 'dp[i - 1][j - 1]',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: 'Math.max(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1])',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          }
        ],
        isVisible: false
      },
      {
        id: 'lcs-final',
        title: 'Return the Result',
        description: 'Complete the function by returning the length of the longest common subsequence.',
        codeTemplate: `function longestCommonSubsequence(text1, text2) {
  // Create DP table
  const m = text1.length;
  const n = text2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  // Fill the DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  return %SLOT-1%;
}`,
        slots: [
          {
            id: 'slot-1',
            correctBlockId: 'block-1',
            filledWithBlockId: null,
            isSolved: false
          }
        ],
        blocks: [
          {
            id: 'block-1',
            content: 'dp[m][n]',
            isCorrect: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-2',
            content: 'dp[m - 1][n - 1]',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: 'Math.max(...dp.flat())',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          }
        ],
        isVisible: false
      }
    ]
  },
  {
    id: 'bubble-sort',
    title: 'Bubble Sort Algorithm',
    description: 'Complete the bubble sort algorithm by filling in the missing logic.',
    difficulty: 2,
    currentSectionIndex: 0,
    sections: [
      {
        id: 'bubble-sort-outer',
        title: 'Outer Loop',
        description: 'First, implement the outer loop of the bubble sort algorithm.',
        codeTemplate: `function bubbleSort(arr) {
  %SLOT-1% {
    // Inner loop will go here
  }
  return arr;
}`,
        slots: [
          {
            id: 'slot-1',
            correctBlockId: 'block-1',
            filledWithBlockId: null,
            isSolved: false
          }
        ],
        blocks: [
          {
            id: 'block-1',
            content: 'for (let i = 0; i < arr.length - 1; i++)',
            isCorrect: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-2',
            content: 'while (i < arr.length)',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: 'for (let i = 0; i < arr.length; i++)',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          }
        ],
        isVisible: true
      },
      {
        id: 'bubble-sort-inner',
        title: 'Inner Loop',
        description: 'Now implement the inner loop that performs the actual swapping.',
        codeTemplate: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    %SLOT-1% {
      if (arr[j] > arr[j + 1]) {
        %SLOT-2%;
      }
    }
  }
  return arr;
}`,
        slots: [
          {
            id: 'slot-1',
            correctBlockId: 'block-1',
            filledWithBlockId: null,
            isSolved: false
          },
          {
            id: 'slot-2',
            correctBlockId: 'block-3',
            filledWithBlockId: null,
            isSolved: false
          }
        ],
        blocks: [
          {
            id: 'block-1',
            content: 'for (let j = 0; j < arr.length - 1 - i; j++)',
            isCorrect: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-2',
            content: 'for (let j = 0; j < arr.length; j++)',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: '[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]',
            isCorrect: true,
            slotId: 'slot-2'
          },
          {
            id: 'block-4',
            content: 'let temp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = temp;',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-2'
          }
        ],
        isVisible: false
      }
    ]
  },
  {
    id: 'merge-sort',
    title: 'Merge Sort Algorithm',
    description: 'Complete the merge sort algorithm by filling in the missing logic.',
    difficulty: 3,
    currentSectionIndex: 0,
    sections: [
      {
        id: 'merge-sort-compare',
        title: 'Step 1: Compare Elements',
        description: 'First, implement the comparison logic to determine which element to add to the result array.',
        codeTemplate: `function merge(left, right) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (%SLOT-1%) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  // To be continued...
}`,
        slots: [
          {
            id: 'slot-1',
            correctBlockId: 'block-1',
            filledWithBlockId: null,
            isSolved: false,
            isIncorrect: false
          }
        ],
        blocks: [
          {
            id: 'block-1',
            content: 'left[i] <= right[j]',
            isCorrect: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-2',
            content: 'left[i] === right[j]',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: 'left[i] > right[j]',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          }
        ],
        isVisible: true
      },
      {
        id: 'merge-sort-return',
        title: 'Step 2: Return Merged Array',
        description: 'Now, return the merged array including any remaining elements.',
        codeTemplate: `function merge(left, right) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  return %SLOT-1%;
}`,
        slots: [
          {
            id: 'slot-1',
            correctBlockId: 'block-1',
            filledWithBlockId: null,
            isSolved: false,
            isIncorrect: false
          }
        ],
        blocks: [
          {
            id: 'block-1',
            content: 'result.concat(left.slice(i)).concat(right.slice(j))',
            isCorrect: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-2',
            content: 'result.concat(left).concat(right)',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: 'result',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          }
        ],
        isVisible: false
      }
    ]
  },
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 1,
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers in nums such that they add up to target.',
    sections: [
      {
        id: 'two-sum-init',
        title: 'Step 1: Initialize Map',
        description: 'Initialize a map to store the indices of the numbers we\'ve seen so far.',
        codeTemplate: `const twoSum = (nums, target) => {
  const map = %SLOT-1%;
  // To be continued...
}`,
        slots: [
          { id: 'slot-1', correctBlockId: 'block-1', filledWithBlockId: null, isSolved: false, isIncorrect: false }
        ],
        blocks: [
          { id: 'block-1', content: 'new Map()', isCorrect: true, slotId: 'slot-1' },
          { id: 'block-2', content: '{} ', isCorrect: false, isDecoy: true, slotId: 'slot-1' },
          { id: 'block-3', content: '[]', isCorrect: false, isDecoy: true, slotId: 'slot-1' }
        ],
        isVisible: true
      },
      {
        id: 'two-sum-loop',
        title: 'Step 2: Loop Through Array',
        description: 'Loop through each number in the array to find the pairs that sum to target.',
        codeTemplate: `const twoSum = (nums, target) => {
  const map = new Map();
  
  %SLOT-1% {
    // To be continued...
  }
  return [];
}`,
        slots: [
          { id: 'slot-1', correctBlockId: 'block-1', filledWithBlockId: null, isSolved: false, isIncorrect: false }
        ],
        blocks: [
          { id: 'block-1', content: 'for (let i = 0; i < nums.length; i++)', isCorrect: true, slotId: 'slot-1' },
          { id: 'block-2', content: 'nums.forEach((num, i) =>', isCorrect: false, isDecoy: true, slotId: 'slot-1' },
          { id: 'block-3', content: 'while (nums.length > 0)', isCorrect: false, isDecoy: true, slotId: 'slot-1' }
        ],
        isVisible: false
      },
      {
        id: 'two-sum-complement',
        title: 'Step 3: Calculate Complement',
        description: 'For each number, calculate its complement (the value needed to reach the target).',
        codeTemplate: `const twoSum = (nums, target) => {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = %SLOT-1%;
    // To be continued...
  }
  return [];
}`,
        slots: [
          { id: 'slot-1', correctBlockId: 'block-1', filledWithBlockId: null, isSolved: false, isIncorrect: false }
        ],
        blocks: [
          { id: 'block-1', content: 'target - nums[i]', isCorrect: true, slotId: 'slot-1' },
          { id: 'block-2', content: 'nums[i] - target', isCorrect: false, isDecoy: true, slotId: 'slot-1' },
          { id: 'block-3', content: 'target / nums[i]', isCorrect: false, isDecoy: true, slotId: 'slot-1' }
        ],
        isVisible: false
      },
      {
        id: 'two-sum-check',
        title: 'Step 4: Check for Complement',
        description: 'Check if the complement is already in the map.',
        codeTemplate: `const twoSum = (nums, target) => {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (%SLOT-1%) {
      return [map.get(complement), i];
    }
    // To be continued...
  }
  return [];
}`,
        slots: [
          { id: 'slot-1', correctBlockId: 'block-1', filledWithBlockId: null, isSolved: false, isIncorrect: false }
        ],
        blocks: [
          { id: 'block-1', content: 'map.has(complement)', isCorrect: true, slotId: 'slot-1' },
          { id: 'block-2', content: 'map.includes(complement)', isCorrect: false, isDecoy: true, slotId: 'slot-1' },
          { id: 'block-3', content: 'complement in map', isCorrect: false, isDecoy: true, slotId: 'slot-1' }
        ],
        isVisible: false
      },
      {
        id: 'two-sum-store',
        title: 'Step 5: Store Number and Index',
        description: 'If the complement isn\'t found, store the current number and its index in the map.',
        codeTemplate: `const twoSum = (nums, target) => {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    %SLOT-1%;
  }
  return [];
}`,
        slots: [
          { id: 'slot-1', correctBlockId: 'block-1', filledWithBlockId: null, isSolved: false, isIncorrect: false }
        ],
        blocks: [
          { id: 'block-1', content: 'map.set(nums[i], i)', isCorrect: true, slotId: 'slot-1' },
          { id: 'block-2', content: 'map[nums[i]] = i', isCorrect: false, isDecoy: true, slotId: 'slot-1' },
          { id: 'block-3', content: 'map.push([nums[i], i])', isCorrect: false, isDecoy: true, slotId: 'slot-1' }
        ],
        isVisible: false
      }
    ],
    currentSectionIndex: 0
  },
  {
    id: 'palindrome-number',
    title: 'Palindrome Number',
    difficulty: 1,
    description: 'Determine whether an integer is a palindrome. An integer is a palindrome when it reads the same backward as forward.',
    sections: [
      {
        id: 'palindrome-convert',
        title: 'Step 1: Convert to String',
        description: 'Convert the integer to a string to make it easier to check if it\'s a palindrome.',
        codeTemplate: `const isPalindrome = (x) => {
  const str = %SLOT-1%;
  // To be continued...
}`,
        slots: [
          { id: 'slot-1', correctBlockId: 'block-1', filledWithBlockId: null, isSolved: false, isIncorrect: false }
        ],
        blocks: [
          { id: 'block-1', content: 'x.toString()', isCorrect: true, slotId: 'slot-1' },
          { id: 'block-2', content: 'String(x)', isCorrect: false, isDecoy: true, slotId: 'slot-1' },
          { id: 'block-3', content: '`${x}`', isCorrect: false, isDecoy: true, slotId: 'slot-1' }
        ],
        isVisible: true
      },
      {
        id: 'palindrome-check',
        title: 'Step 2: Check if Palindrome',
        description: 'Compare the string with its reversed version to check if it\'s a palindrome.',
        codeTemplate: `const isPalindrome = (x) => {
  const str = x.toString();
  return %SLOT-1%;
}`,
        slots: [
          { id: 'slot-1', correctBlockId: 'block-1', filledWithBlockId: null, isSolved: false, isIncorrect: false }
        ],
        blocks: [
          { id: 'block-1', content: 'str === str.split("").reverse().join("")', isCorrect: true, slotId: 'slot-1' },
          { id: 'block-2', content: 'str.charAt(0) === str.charAt(str.length - 1)', isCorrect: false, isDecoy: true, slotId: 'slot-1' },
          { id: 'block-3', content: 'Array.from(str).sort().join("") === str', isCorrect: false, isDecoy: true, slotId: 'slot-1' }
        ],
        isVisible: false
      }
    ],
    currentSectionIndex: 0
  },
  {
    id: 'roman-to-integer',
    title: 'Roman to Integer',
    difficulty: 1,
    description: 'Convert a Roman numeral to an integer.',
    sections: [
      {
        id: 'roman-values',
        title: 'Step 1: Define Roman Values',
        description: 'Define a map of Roman numerals to their integer values.',
        codeTemplate: `const romanToInt = (s) => {
  const roman = %SLOT-1%;
  let result = 0;
  // To be continued...
};`,
        slots: [
          { id: 'slot-1', correctBlockId: 'block-1', filledWithBlockId: null, isSolved: false, isIncorrect: false }
        ],
        blocks: [
          { id: 'block-1', content: '{ I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }', isCorrect: true, slotId: 'slot-1' },
          { id: 'block-2', content: '{ I: 1, V: 5, X: 10, L: 100, C: 50, D: 500, M: 1000 }', isCorrect: false, isDecoy: true, slotId: 'slot-1' },
          { id: 'block-3', content: 'new Map([["I", 1], ["V", 5], ["X", 10], ["L", 50], ["C", 100], ["D", 500], ["M", 1000]])', isCorrect: false, isDecoy: true, slotId: 'slot-1' }
        ],
        isVisible: true
      },
      {
        id: 'roman-init',
        title: 'Step 2: Initialize Result',
        description: 'Initialize a variable to store the result.',
        codeTemplate: `const romanToInt = (s) => {
  const roman = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let result = %SLOT-1%;
  // To be continued...
};`,
        slots: [
          { id: 'slot-1', correctBlockId: 'block-1', filledWithBlockId: null, isSolved: false, isIncorrect: false }
        ],
        blocks: [
          { id: 'block-1', content: '0', isCorrect: true, slotId: 'slot-1' },
          { id: 'block-2', content: '[]', isCorrect: false, isDecoy: true, slotId: 'slot-1' },
          { id: 'block-3', content: 'null', isCorrect: false, isDecoy: true, slotId: 'slot-1' }
        ],
        isVisible: false
      },
      {
        id: 'roman-loop',
        title: 'Step 3: Loop Through Roman Numeral',
        description: 'Loop through each character in the Roman numeral string.',
        codeTemplate: `const romanToInt = (s) => {
  const roman = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let result = 0;
  
  %SLOT-1% {
    // To be continued...
  }
};`,
        slots: [
          { id: 'slot-1', correctBlockId: 'block-1', filledWithBlockId: null, isSolved: false, isIncorrect: false }
        ],
        blocks: [
          { id: 'block-1', content: 'for (let i = 0; i < s.length; i++)', isCorrect: true, slotId: 'slot-1' },
          { id: 'block-2', content: 'while (s.length > 0)', isCorrect: false, isDecoy: true, slotId: 'slot-1' },
          { id: 'block-3', content: 's.split("").forEach((char, i) =>', isCorrect: false, isDecoy: true, slotId: 'slot-1' }
        ],
        isVisible: false
      },
      {
        id: 'roman-compare',
        title: 'Step 4: Compare Adjacent Values',
        description: 'Check if the current Roman numeral is less than the next one to handle subtraction cases like "IV" (4).',
        codeTemplate: `const romanToInt = (s) => {
  const roman = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let result = 0;
  
  for (let i = 0; i < s.length; i++) {
    if (%SLOT-1%) {
      result -= roman[s[i]];
    } else {
      result += roman[s[i]];
    }
  }
  // To be continued...
};`,
        slots: [
          { id: 'slot-1', correctBlockId: 'block-1', filledWithBlockId: null, isSolved: false, isIncorrect: false }
        ],
        blocks: [
          { id: 'block-1', content: 'roman[s[i]] < roman[s[i + 1]]', isCorrect: true, slotId: 'slot-1' },
          { id: 'block-2', content: 'roman[s[i]] > roman[s[i + 1]]', isCorrect: false, isDecoy: true, slotId: 'slot-1' },
          { id: 'block-3', content: 's[i] === "I" && (s[i+1] === "V" || s[i+1] === "X")', isCorrect: false, isDecoy: true, slotId: 'slot-1' }
        ],
        isVisible: false
      },
      {
        id: 'roman-return',
        title: 'Step 5: Return Result',
        description: 'Return the final calculated integer value.',
        codeTemplate: `const romanToInt = (s) => {
  const roman = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let result = 0;
  
  for (let i = 0; i < s.length; i++) {
    if (roman[s[i]] < roman[s[i + 1]]) {
      result -= roman[s[i]];
    } else {
      result += roman[s[i]];
    }
  }
  
  return %SLOT-1%;
};`,
        slots: [
          { id: 'slot-1', correctBlockId: 'block-1', filledWithBlockId: null, isSolved: false, isIncorrect: false }
        ],
        blocks: [
          { id: 'block-1', content: 'result', isCorrect: true, slotId: 'slot-1' },
          { id: 'block-2', content: 'parseInt(result)', isCorrect: false, isDecoy: true, slotId: 'slot-1' },
          { id: 'block-3', content: 'Number(result.toFixed(0))', isCorrect: false, isDecoy: true, slotId: 'slot-1' }
        ],
        isVisible: false
      }
    ],
    currentSectionIndex: 0
  },
  {
    id: 'merge-intervals',
    title: 'Merge Overlapping Intervals',
    description: 'Fill in the missing logic to merge overlapping intervals. \n\nExample Input: [[1,3], [2,6], [8,10], [15,18]] \nExample Output: [[1,6], [8,10], [15,18]]',
    difficulty: 3,
    currentSectionIndex: 0,
    sections: [
      {
        id: 'merge-sort',
        title: 'Sort the Intervals',
        description: 'Start by sorting the intervals based on start times.',
        codeTemplate: `function mergeIntervals(intervals) {
  intervals.sort((a, b) => %SLOT-1%);
  let merged = [];
  // To be continued...
}`,
        slots: [
          {
            id: 'slot-1',
            correctBlockId: 'block-1',
            filledWithBlockId: null,
            isSolved: false
          }
        ],
        blocks: [
          {
            id: 'block-1',
            content: 'a[0] - b[0]',
            isCorrect: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-2',
            content: 'b[0] - a[0]',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: 'Math.min(a[0], b[0])',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          }
        ],
        isVisible: true
      },
      {
        id: 'merge-loop',
        title: 'Merge the Intervals',
        description: 'Loop through the intervals and merge overlapping ones.',
        codeTemplate: `function mergeIntervals(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  let merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    let last = merged[merged.length - 1];
    if (%SLOT-1%) {
      last[1] = Math.max(last[1], intervals[i][1]);
    } else {
      merged.push(intervals[i]);
    }
  }
  return merged;
}`,
        slots: [
          {
            id: 'slot-1',
            correctBlockId: 'block-1',
            filledWithBlockId: null,
            isSolved: false
          }
        ],
        blocks: [
          {
            id: 'block-1',
            content: 'intervals[i][0] <= last[1]',
            isCorrect: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-2',
            content: 'intervals[i][1] >= last[0]',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: 'last[1] >= intervals[i][0]',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          }
        ],
        isVisible: false
      }
    ]
  },
  {
    id: 'dijkstra',
    title: "Dijkstra's Algorithm",
    description: 'Find the shortest path from the source node in a weighted graph. \n\nExample Input: Graph with nodes A, B, C and edges (A→B: 5, A→C: 10, B→C: 3), start=A \nExample Output: {A: 0, B: 5, C: 8}',
    difficulty: 5,
    currentSectionIndex: 0,
    sections: [
      {
        id: 'initialize-queue',
        title: 'Initialize the Priority Queue',
        description: 'Start by initializing the min-heap priority queue.',
        codeTemplate: `function dijkstra(graph, start) {
  let distances = {};
  let queue = new PriorityQueue((a, b) => %SLOT-1%);
  queue.enqueue([start, 0]);
  // To be continued...
}`,
        slots: [
          {
            id: 'slot-1',
            correctBlockId: 'block-1',
            filledWithBlockId: null,
            isSolved: false
          }
        ],
        blocks: [
          {
            id: 'block-1',
            content: 'a[1] - b[1]',
            isCorrect: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-2',
            content: 'b[1] - a[1]',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: 'Math.min(a[1], b[1])',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          }
        ],
        isVisible: true
      }
    ]
  }
];

export const initialUserProgress: UserProgress = {
  elo: 1200,
  solvedPuzzles: [],
  currentPuzzleIndex: 0
}; 