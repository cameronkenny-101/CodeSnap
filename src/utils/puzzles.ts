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
    description: 'Complete the binary search algorithm by filling in the missing logic.',
    difficulty: 3,
    currentSectionIndex: 0,
    sections: [
      {
        id: 'binary-search-mid',
        title: 'Calculate the Middle Index',
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
            content: '(left + right) / 2',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: 'Math.round((left + right) / 2)',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          }
        ],
        isVisible: true
      },
      {
        id: 'binary-search-found',
        title: 'Check if Target is Found',
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
            content: 'arr[mid] == target',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: 'target === arr[mid]',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          }
        ],
        isVisible: false
      },
      {
        id: 'binary-search-left',
        title: 'Move Left Pointer',
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
            content: 'target > arr[mid]',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: 'arr[mid] <= target',
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
            content: 'left + 1',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-2'
          }
        ],
        isVisible: false
      },
      {
        id: 'binary-search-right',
        title: 'Complete the Algorithm',
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
            content: 'mid',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: 'right - 1',
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
            content: 'null',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-2'
          },
          {
            id: 'block-6',
            content: 'false',
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
    difficulty: 4,
    currentSectionIndex: 0,
    sections: [
      {
        id: 'merge-sort-merge',
        title: 'Merge Function',
        description: 'First, implement the merge function that combines two sorted arrays.',
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
            correctBlockId: 'block-3',
            filledWithBlockId: null,
            isSolved: false
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
            content: 'left[i] < right[j]',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: '[...result, ...left.slice(i), ...right.slice(j)]',
            isCorrect: true,
            slotId: 'slot-2'
          },
          {
            id: 'block-4',
            content: 'result.concat(left.slice(i)).concat(right.slice(j))',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-2'
          }
        ],
        isVisible: true
      },
      {
        id: 'merge-sort-split',
        title: 'Split Function',
        description: 'Now implement the recursive split function that divides the array.',
        codeTemplate: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = %SLOT-1%;
  const left = %SLOT-2%;
  const right = %SLOT-3%;
  
  return merge(mergeSort(left), mergeSort(right));
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
            correctBlockId: 'block-2',
            filledWithBlockId: null,
            isSolved: false
          },
          {
            id: 'slot-3',
            correctBlockId: 'block-3',
            filledWithBlockId: null,
            isSolved: false
          }
        ],
        blocks: [
          {
            id: 'block-1',
            content: 'Math.floor(arr.length / 2)',
            isCorrect: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-2',
            content: 'arr.slice(0, mid)',
            isCorrect: true,
            slotId: 'slot-2'
          },
          {
            id: 'block-3',
            content: 'arr.slice(mid)',
            isCorrect: true,
            slotId: 'slot-3'
          },
          {
            id: 'block-4',
            content: 'arr.length / 2',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-5',
            content: 'arr.splice(0, mid)',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-2'
          },
          {
            id: 'block-6',
            content: 'arr.splice(mid)',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-3'
          }
        ],
        isVisible: false
      }
    ]
  },
  {
    id: 'two-sum',
    title: 'Two Sum Algorithm',
    description: 'Complete the two sum algorithm by filling in the missing logic.',
    difficulty: 1,
    currentSectionIndex: 0,
    sections: [
      {
        id: 'two-sum-init',
        title: 'Initialize the HashMap',
        description: 'Start by creating a hash map to store seen numbers.',
        codeTemplate: `function twoSum(nums, target) {
  let map = %SLOT-1%;
  
  for (let i = 0; i < nums.length; i++) {
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
            content: '{}',
            isCorrect: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-2',
            content: '[]',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: 'new Map()',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          }
        ],
        isVisible: true
      },
      {
        id: 'two-sum-lookup',
        title: 'Check if Complement Exists',
        description: 'Now, check if the complement is already in the map.',
        codeTemplate: `function twoSum(nums, target) {
  let map = {};

  for (let i = 0; i < nums.length; i++) {
    let complement = %SLOT-1%;

    if (%SLOT-2%) {
      return [map[complement], i];
    }
    map[nums[i]] = i;
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
            content: 'target - nums[i]',
            isCorrect: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-2',
            content: 'target + nums[i]',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: 'nums[i] - target',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-4',
            content: 'complement in map',
            isCorrect: true,
            slotId: 'slot-2'
          },
          {
            id: 'block-5',
            content: 'map.includes(complement)',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-2'
          },
          {
            id: 'block-6',
            content: 'map.hasOwnProperty(complement)',
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
    id: 'merge-intervals',
    title: 'Merge Overlapping Intervals',
    description: 'Fill in the missing logic to merge overlapping intervals.',
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
    description: 'Find the shortest path from the source node in a weighted graph.',
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