// ============================================
// ASSESSMENT.JS — Quiz Logic
// ============================================
// Contains:
//   1. Correct answers
//   2. Calculate score
//   3. Get grade (using if-else)
//   4. Get feedback (using switch)
//   5. Display results
//   6. Save to localStorage
//   7. Retake quiz
// ============================================


// ============================================
// SECTION 1: Correct Answers Object
// ============================================
// Each key is the question name (q1, q2, etc.)
// Each value is the correct answer letter

const correctAnswers = {
    q1: "B",
    q2: "B",
    q3: "B",
    q4: "B",
    q5: "B"
};

// Total number of questions
const totalQuestions = 5;


// ============================================
// FUNCTION: Calculate Score
// ============================================
// Called when user clicks "Submit Assessment"
// onclick="calculateScore()"

function calculateScore() {

    let score = 0;

    // Loop through each question (q1 to q5)
    for (let i = 1; i <= totalQuestions; i++) {

        // Build the question name: "q1", "q2", "q3"...
        let questionName = "q" + i;

        // Find the selected radio button for this question
        // selector: input[name="q1"]:checked
        // → finds an <input> with name="q1" that is currently selected
        let selected = document.querySelector('input[name="' + questionName + '"]:checked');

        // Check if user answered this question
        if (selected === null) {
            alert("Please answer all questions before submitting!");
            return;  // Stop — don't calculate
        }

        // Compare selected answer with correct answer
        if (selected.value === correctAnswers[questionName]) {
            score++;
        }
    }

    // Calculate percentage
    let percentage = (score / totalQuestions) * 100;

    // Get grade using if-else (PDF requirement)
    let grade = getGrade(percentage);

    // Get feedback using switch (PDF requirement)
    let feedback = getFeedback(grade);

    // Show results on page
    displayResults(score, percentage, grade, feedback);

    // Save results to localStorage
    saveResults(score, percentage, grade);
}


// ============================================
// FUNCTION: Get Grade (using if-else)
// ============================================
// PDF requires if-else for grade calculation
//
// Parameters:
//   percentage — the score percentage (0 to 100)
//
// Returns:
//   A letter grade (A, B, C, D, or F)

function getGrade(percentage) {

    if (percentage >= 90) {
        return "A";
    } else if (percentage >= 80) {
        return "B";
    } else if (percentage >= 60) {
        return "C";
    } else if (percentage >= 40) {
        return "D";
    } else {
        return "F";
    }
}


// ============================================
// FUNCTION: Get Feedback (using switch)
// ============================================
// PDF requires switch for performance feedback
//
// Parameters:
//   grade — the letter grade (A, B, C, D, or F)
//
// Returns:
//   A feedback message string

function getFeedback(grade) {

    switch (grade) {
        case "A":
            return "Excellent Performance! Outstanding work!";
        case "B":
            return "Good Performance! Keep it up!";
        case "C":
            return "Average Performance. Room for improvement.";
        case "D":
            return "Below Average. Needs more practice.";
        case "F":
            return "Poor Performance. Please retake the assessment.";
        default:
            return "No feedback available.";
    }
}


// ============================================
// FUNCTION: Display Results on Page
// ============================================
// Makes the result section visible and fills it with data

function displayResults(score, percentage, grade, feedback) {

    // Step 1: Show the result section (was hidden with display:none)
    document.getElementById("resultSection").style.display = "block";

    // Step 2: Update text content
    document.getElementById("scoreDisplay").textContent = score + "/" + totalQuestions;
    document.getElementById("percentageDisplay").textContent = percentage + "%";
    document.getElementById("gradeDisplay").textContent = grade;
    document.getElementById("feedbackDisplay").textContent = feedback;

    // Step 3: Update progress bar
    let progressBar = document.getElementById("scoreProgressBar");
    progressBar.style.width = percentage + "%";
    progressBar.textContent = percentage + "%";
    progressBar.setAttribute("aria-valuenow", percentage);

    // Step 4: Change progress bar color based on score
    if (percentage >= 80) {
        progressBar.className = "progress-bar bg-success";
    } else if (percentage >= 60) {
        progressBar.className = "progress-bar bg-warning";
    } else {
        progressBar.className = "progress-bar bg-danger";
    }

    // Step 5: Change alert color based on score
    let resultAlert = document.getElementById("resultAlert");
    if (percentage >= 80) {
        resultAlert.className = "alert alert-success";
    } else if (percentage >= 60) {
        resultAlert.className = "alert alert-warning";
    } else {
        resultAlert.className = "alert alert-danger";
    }

    // Step 6: Smooth scroll to results
    document.getElementById("resultSection").scrollIntoView({ 
        behavior: "smooth" 
    });
}


// ============================================
// FUNCTION: Save Results to localStorage
// ============================================
// Saves quiz results so Profile page can read them

function saveResults(score, percentage, grade) {

    let results = {
        score: score,
        total: totalQuestions,
        percentage: percentage,
        grade: grade,
        date: new Date().toLocaleDateString()
    };

    let selectedId = getFromStorage("selectedEmployee");
    let allEmployees = getFromStorage("employees");

    let employee = allEmployees.find(emp => emp.id === selectedId);

    if (employee) {
        employee.performance = percentage;

        // ⭐ IMPORTANT FIX
        employee.assessment = results;
    }

    saveToStorage("employees", allEmployees);
}


// ============================================
// FUNCTION: Retake Quiz
// ============================================
// Called when user clicks "Retake Assessment"

function retakeQuiz() {

    // Step 1: Clear all radio button selections
    document.getElementById("quizForm").reset();

    // Step 2: Hide the result section
    document.getElementById("resultSection").style.display = "none";

    // Step 3: Scroll back to top of page
    window.scrollTo({ top: 0, behavior: "smooth" });
}


// ============================================
// FUNCTION: Check if Passed (for Jest testing)
// ============================================
// PDF requires this function for Jest test cases
// A simple function that returns true if score >= 50%

function isPassed(percentage) {
    return percentage >= 50;
}


// ============================================
// FUNCTION: Calculate Percentage (for Jest testing)
// ============================================
// PDF requires this for Jest test cases

function calculatePercentage(score, total) {
    return (score / total) * 100;
}


// ============================================
// PAGE INITIALIZATION
// ============================================

if (typeof window !== "undefined") {

    $(document).ready(function() {

        $("#submitQuiz").click(function() {
            calculateScore();
        });

    });

}

// For Jest testing
if (typeof module !== "undefined") {
    module.exports = {
        getGrade,
        isPassed,
        calculatePercentage
    };
}