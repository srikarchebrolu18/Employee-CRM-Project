// Import functions (adjust path if needed)
const { getGrade, isPassed, calculatePercentage } = require("../js/assessment");

// Test getGrade()
test("Grade A for >= 90%", () => {
    expect(getGrade(95)).toBe("A");
});

test("Grade B for >= 80%", () => {
    expect(getGrade(85)).toBe("B");
});

test("Grade C for >= 60%", () => {
    expect(getGrade(65)).toBe("C");
});

test("Grade D for >= 40%", () => {
    expect(getGrade(45)).toBe("D");
});

test("Grade F for < 40%", () => {
    expect(getGrade(30)).toBe("F");
});

// Test isPassed()
test("Pass if >= 50%", () => {
    expect(isPassed(60)).toBe(true);
});

test("Fail if < 50%", () => {
    expect(isPassed(40)).toBe(false);
});

// Test calculatePercentage()
test("Correct percentage calculation", () => {
    expect(calculatePercentage(4, 5)).toBe(80);
});