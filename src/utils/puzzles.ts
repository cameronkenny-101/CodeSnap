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
        title: 'Step 1: Find the Middle',
        description: 'Calculate the middle index for the binary search algorithm.',
        codeTemplate: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    let mid = %SLOT-1%;
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
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
        id: 'binary-search-left',
        title: 'Step 2: Update Left Pointer',
        description: 'Update the left pointer when the target is in the right half.',
        codeTemplate: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = %SLOT-1%;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
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
            content: 'mid + 1',
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
            content: 'left + 1',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          }
        ],
        isVisible: false
      },
      {
        id: 'binary-search-right',
        title: 'Step 3: Update Right Pointer',
        description: 'Update the right pointer when the target is in the left half.',
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
  
  return -1;
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
        title: 'Step 1: Create DP Table',
        description: 'Initialize a 2D array for the dynamic programming table.',
        codeTemplate: `function longestCommonSubsequence(text1, text2) {
  // Create DP table
  const m = text1.length;
  const n = text2.length;
  const dp = %SLOT-1%;
  
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
  
  return dp[m][n];
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
        id: 'lcs-match',
        title: 'Step 2: Handle Matching Characters',
        description: 'When characters match, add 1 to the diagonal value in the DP table.',
        codeTemplate: `function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = %SLOT-1%;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  return dp[m][n];
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
            content: 'dp[i - 1][j - 1] + 1',
            isCorrect: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-2',
            content: '1 + dp[i - 1][j - 1]',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: 'Math.max(dp[i][j], dp[i - 1][j - 1] + 1)',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          }
        ],
        isVisible: false
      },
      {
        id: 'lcs-mismatch',
        title: 'Step 3: Handle Non-Matching Characters',
        description: 'When characters don\'t match, take the maximum of the left and top values.',
        codeTemplate: `function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = %SLOT-1%;
      }
    }
  }
  
  return dp[m][n];
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
            content: 'dp[i - 1][j] + dp[i][j - 1]',
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
        title: 'Step 1: Outer Loop',
        description: 'Create the outer loop for the bubble sort algorithm.',
        codeTemplate: `function bubbleSort(arr) {
  %SLOT-1% {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
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
            isSolved: false,
            isIncorrect: false
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
            content: 'for (let i = 0; i < arr.length; i++)',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: 'while (arr.length)',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          }
        ],
        isVisible: true
      },
      {
        id: 'bubble-sort-inner',
        title: 'Step 2: Inner Loop',
        description: 'Create the inner loop that compares adjacent elements.',
        codeTemplate: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    %SLOT-1% {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
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
            isSolved: false,
            isIncorrect: false
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
            content: 'for (let j = i + 1; j < arr.length; j++)',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          }
        ],
        isVisible: false
      },
      {
        id: 'bubble-sort-swap',
        title: 'Step 3: Swap Elements',
        description: 'Swap adjacent elements if they are in the wrong order.',
        codeTemplate: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        %SLOT-1%;
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
            isSolved: false,
            isIncorrect: false
          }
        ],
        blocks: [
          {
            id: 'block-1',
            content: '[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]',
            isCorrect: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-2',
            content: 'let temp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = temp',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: 'swap(arr, j, j + 1)',
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
        id: 'two-sum-setup',
        title: 'Step 1: Set Up Function',
        description: 'Initialize a map to store values and set up the loop.',
        codeTemplate: `const twoSum = (nums, target) => {
  const map = new Map();
  
  %SLOT-1% {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}`,
        slots: [
          { id: 'slot-1', correctBlockId: 'block-1', filledWithBlockId: null, isSolved: false, isIncorrect: false }
        ],
        blocks: [
          { id: 'block-1', content: 'for (let i = 0; i < nums.length; i++)', isCorrect: true, slotId: 'slot-1' },
          { id: 'block-2', content: 'nums.forEach((num, i) =>', isCorrect: false, isDecoy: true, slotId: 'slot-1' },
          { id: 'block-3', content: 'for (let i in nums)', isCorrect: false, isDecoy: true, slotId: 'slot-1' }
        ],
        isVisible: true
      },
      {
        id: 'two-sum-complement',
        title: 'Step 2: Find Complement',
        description: 'Calculate the complement and check if it exists in our map.',
        codeTemplate: `const twoSum = (nums, target) => {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = %SLOT-1%;
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}`,
        slots: [
          { id: 'slot-1', correctBlockId: 'block-1', filledWithBlockId: null, isSolved: false, isIncorrect: false }
        ],
        blocks: [
          { id: 'block-1', content: 'target - nums[i]', isCorrect: true, slotId: 'slot-1' },
          { id: 'block-2', content: 'nums[i] - target', isCorrect: false, isDecoy: true, slotId: 'slot-1' },
          { id: 'block-3', content: 'target + nums[i]', isCorrect: false, isDecoy: true, slotId: 'slot-1' }
        ],
        isVisible: false
      },
      {
        id: 'two-sum-store',
        title: 'Step 3: Store Current Number',
        description: 'Store the current number and its index in the map.',
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
          { id: 'block-3', content: 'map.add(nums[i], i)', isCorrect: false, isDecoy: true, slotId: 'slot-1' }
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
        title: 'Step 1: Create Roman Numeral Map',
        description: 'Create a map with Roman numeral values to convert them to integers.',
        codeTemplate: `const romanToInt = (s) => {
  const roman = %SLOT-1%;
  let result = 0;
  
  for (let i = 0; i < s.length; i++) {
    if (roman[s[i]] < roman[s[i + 1]]) {
      result -= roman[s[i]];
    } else {
      result += roman[s[i]];
    }
  }
  
  return result;
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
        id: 'roman-compare',
        title: 'Step 2: Compare Adjacent Values',
        description: 'Compare adjacent Roman numerals to determine if subtraction is needed.',
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
  
  return result;
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
        id: 'roman-accumulate',
        title: 'Step 3: Accumulate the Result',
        description: 'Accumulate the result by adding or subtracting Roman numeral values.',
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
  
  return result;
};`,
        slots: [
          { id: 'slot-1', correctBlockId: 'block-1', filledWithBlockId: null, isSolved: false, isIncorrect: false }
        ],
        blocks: [
          { id: 'block-1', content: '-= roman[s[i]]', isCorrect: true, slotId: 'slot-1' },
          { id: 'block-2', content: '= result - roman[s[i]]', isCorrect: false, isDecoy: true, slotId: 'slot-1' },
          { id: 'block-3', content: '= result - (roman[s[i+1]] - roman[s[i]])', isCorrect: false, isDecoy: true, slotId: 'slot-1' }
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
        title: 'Step 1: Sort Intervals',
        description: 'Sort the intervals based on their start times to process them in order.',
        codeTemplate: `function mergeIntervals(intervals) {
  intervals.sort((a, b) => %SLOT-1%);
  let merged = [intervals[0]];
  
  for (let i = 1; i < intervals.length; i++) {
    let last = merged[merged.length - 1];
    if (intervals[i][0] <= last[1]) {
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
            isSolved: false,
            isIncorrect: false
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
            content: 'a[1] - b[1]',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          }
        ],
        isVisible: true
      },
      {
        id: 'merge-overlap',
        title: 'Step 2: Check for Overlap',
        description: 'Determine if the current interval overlaps with the previously merged interval.',
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
            isSolved: false,
            isIncorrect: false
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
            content: 'intervals[i][0] < last[0]',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          }
        ],
        isVisible: false
      },
      {
        id: 'merge-update',
        title: 'Step 3: Update Merged Interval',
        description: 'Update the end of the merged interval when an overlap is found.',
        codeTemplate: `function mergeIntervals(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  let merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    let last = merged[merged.length - 1];
    if (intervals[i][0] <= last[1]) {
      last[1] = %SLOT-1%;
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
            isSolved: false,
            isIncorrect: false
          }
        ],
        blocks: [
          {
            id: 'block-1',
            content: 'Math.max(last[1], intervals[i][1])',
            isCorrect: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-2',
            content: 'intervals[i][1]',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: 'last[1] + (intervals[i][1] - intervals[i][0])',
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
        id: 'dijkstra-init',
        title: 'Step 1: Initialize Distance Map',
        description: 'Initialize the distance map to track shortest distances from the start.',
        codeTemplate: `function dijkstra(graph, start) {
  // Initialize distances with Infinity for all nodes except start
  const distances = {};
  const visited = new Set();
  const queue = [[start, 0]]; // [node, distance]
  
  // Initialize all distances as infinity
  for (const node in graph) {
    distances[node] = %SLOT-1%;
  }
  
  // Set start node distance to 0
  distances[start] = 0;
  
  while (queue.length > 0) {
    // Sort queue by distance (min to max)
    queue.sort((a, b) => a[1] - b[1]);
    
    const [currentNode, currentDistance] = queue.shift();
    
    // Process neighbors
    for (const neighbor in graph[currentNode]) {
      const distance = currentDistance + graph[currentNode][neighbor];
      
      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
        queue.push([neighbor, distance]);
      }
    }
  }
  
  return distances;
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
            content: 'Infinity',
            isCorrect: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-2',
            content: '-1',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: 'Number.MAX_VALUE',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          }
        ],
        isVisible: true
      },
      {
        id: 'dijkstra-process',
        title: 'Step 2: Process Current Node',
        description: 'Extract the node with minimum distance from the queue.',
        codeTemplate: `function dijkstra(graph, start) {
  const distances = {};
  const visited = new Set();
  let queue = [[start, 0]]; // [node, distance]
  
  // Initialize distances
  for (const node in graph) {
    distances[node] = Infinity;
  }
  distances[start] = 0;
  
  while (queue.length > 0) {
    // Sort queue and extract node with minimum distance
    %SLOT-1%;
    
    const [currentNode, currentDistance] = queue.shift();
    
    // Skip if already visited
    if (visited.has(currentNode)) continue;
    visited.add(currentNode);
    
    // Process neighbors
    for (const neighbor in graph[currentNode]) {
      const distance = currentDistance + graph[currentNode][neighbor];
      
      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
        queue.push([neighbor, distance]);
      }
    }
  }
  
  return distances;
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
            content: 'queue.sort((a, b) => a[1] - b[1])',
            isCorrect: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-2',
            content: 'queue.sort()',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: 'queue = queue.sort()',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          }
        ],
        isVisible: false
      },
      {
        id: 'dijkstra-update',
        title: 'Step 3: Update Neighbor Distances',
        description: 'Update distances to neighbors if a shorter path is found.',
        codeTemplate: `function dijkstra(graph, start) {
  const distances = {};
  const visited = new Set();
  let queue = [[start, 0]]; // [node, distance]
  
  // Initialize distances
  for (const node in graph) {
    distances[node] = Infinity;
  }
  distances[start] = 0;
  
  while (queue.length > 0) {
    queue.sort((a, b) => a[1] - b[1]);
    const [currentNode, currentDistance] = queue.shift();
    
    if (visited.has(currentNode)) continue;
    visited.add(currentNode);
    
    // Process each neighbor
    for (const neighbor in graph[currentNode]) {
      const newDistance = %SLOT-1%;
      
      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        queue.push([neighbor, newDistance]);
      }
    }
  }
  
  return distances;
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
            content: 'currentDistance + graph[currentNode][neighbor]',
            isCorrect: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-2',
            content: 'graph[currentNode][neighbor]',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          },
          {
            id: 'block-3',
            content: 'distances[currentNode] + graph[currentNode][neighbor]',
            isCorrect: false,
            isDecoy: true,
            slotId: 'slot-1'
          }
        ],
        isVisible: false
      }
    ]
  }
];

export const initialUserProgress: UserProgress = {
  elo: 1200,
  solvedPuzzles: [],
  currentPuzzleIndex: 0
}; 