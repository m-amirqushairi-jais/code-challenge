# Problem 4: Three Ways to Sum to n

Three different implementations of a function that calculates the sum of all numbers from 1 to n.

## Problem Description

Given a positive integer `n`, return the sum: 1 + 2 + 3 + ... + n

**Example:** `sum_to_n(5)` returns `15` because 1 + 2 + 3 + 4 + 5 = 15

## Implementations

### 1. `sum_to_n_a` - Iterative Approach
Uses a for loop to accumulate the sum.
- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

### 2. `sum_to_n_b` - Recursive Approach
Calls itself recursively to build the sum.
- **Time Complexity:** O(n)
- **Space Complexity:** O(n) - uses call stack

### 3. `sum_to_n_c` - Mathematical Formula (Gauss)
Uses the formula: `n × (n + 1) / 2`
- **Time Complexity:** O(1) - most efficient
- **Space Complexity:** O(1)

## Prerequisites

- Node.js (v16 or higher)
- npm

## Installation

```bash
npm install
```

## Running the Code

### Option 1: Run with TypeScript (Recommended)
```bash
npm test
```

or

```bash
npm run dev
```

### Option 2: Build and Run
```bash
# Compile TypeScript to JavaScript
npm run build

# Run the compiled version
npm start
```

## Expected Output

```
==================================================
Problem 4: Three Ways to Sum to n
==================================================
sum_to_n_a(0) = 0 | Expected: 0 | PASS
sum_to_n_b(0) = 0 | Expected: 0 | PASS
sum_to_n_c(0) = 0 | Expected: 0 | PASS
--------------------------------------------------
sum_to_n_a(1) = 1 | Expected: 1 | PASS
sum_to_n_b(1) = 1 | Expected: 1 | PASS
sum_to_n_c(1) = 1 | Expected: 1 | PASS
--------------------------------------------------
sum_to_n_a(5) = 15 | Expected: 15 | PASS
sum_to_n_b(5) = 15 | Expected: 15 | PASS
sum_to_n_c(5) = 15 | Expected: 15 | PASS
--------------------------------------------------
sum_to_n_a(10) = 55 | Expected: 55 | PASS
sum_to_n_b(10) = 55 | Expected: 55 | PASS
sum_to_n_c(10) = 55 | Expected: 55 | PASS
--------------------------------------------------
sum_to_n_a(100) = 5050 | Expected: 5050 | PASS
sum_to_n_b(100) = 5050 | Expected: 5050 | PASS
sum_to_n_c(100) = 5050 | Expected: 5050 | PASS
--------------------------------------------------
```

## Project Structure

```
problem4/
├── src/
│   └── index.ts          # Three sum implementations
├── dist/                 # Compiled JavaScript (after build)
├── node_modules/         # Dependencies
├── package.json          # Project configuration
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## Test Cases

The code automatically tests with the following values:
- `n = 0` → Expected: 0
- `n = 1` → Expected: 1
- `n = 5` → Expected: 15
- `n = 10` → Expected: 55
- `n = 100` → Expected: 5050

All three implementations should produce the same results.

## Troubleshooting

### If `npm install` fails:
```bash
npm install --legacy-peer-deps
```

### If you don't want to install dependencies:
```bash
npx ts-node src/index.ts
```

## License

MIT