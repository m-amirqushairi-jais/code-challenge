/**
 * Three implementations of sum to n function
 */

function sum_to_n_a(n: number): number {
    if (n <= 0) return 0;

    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

function sum_to_n_b(n: number): number {
    if (n <= 0) return 0;

    if (n === 1) return 1;

    return n + sum_to_n_b(n - 1);
}

function sum_to_n_c(n: number): number {
    if (n <= 0) return 0;

    let sum = 0;
    sum = (n * (n + 1)) / 2;
    return sum;
}

// Test the functions
const testValues: { val: number, expected: number }[] = [
    { val: 0, expected: 0 },
    { val: 1, expected: 1 },
    { val: 5, expected: 15 },
    { val: 10, expected: 55 },
    { val: 100, expected: 5050 },
];

console.log("=".repeat(50));
console.log("Problem 4: Three Ways to Sum to n");
console.log("=".repeat(50));

for (const { val, expected } of testValues) {
    const resultA = sum_to_n_a(val);
    const resultB = sum_to_n_b(val);
    const resultC = sum_to_n_c(val);
    console.log(`sum_to_n_a(${val}) = ${resultA} | Expected: ${expected} | ${resultA === expected ? "PASS" : "FAIL"}`);
    console.log(`sum_to_n_b(${val}) = ${resultB} | Expected: ${expected} | ${resultB === expected ? "PASS" : "FAIL"}`);
    console.log(`sum_to_n_c(${val}) = ${resultC} | Expected: ${expected} | ${resultC === expected ? "PASS" : "FAIL"}`);
    console.log("-".repeat(50));
}

module.exports = { sum_to_n_a, sum_to_n_b, sum_to_n_c };