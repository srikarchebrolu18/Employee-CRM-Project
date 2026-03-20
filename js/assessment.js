
const correctAnswers = {
    q1: "B",
    q2: "B",
    q3: "B",
    q4: "B",
    q5: "B"
};

// Total number of questions
const totalQuestions = 5;



function calculateScore() {

    let score = 0;

    // Loop through each question (q1 to q5)
    for (let i = 1; i <= totalQuestions; i++) {

        // Build the question name: "q1", "q2", "q3"...
        let questionName = "q" + i;

        // Find the selected radio button for this question
        let selected = document.querySelector('input[name="' + questionName + '"]:checked');

        // Check if user answered this question
        if (selected === null) {
            alert("Please answer all questions before submitting!");
            return; 
        }

        if (selected.value === correctAnswers[questionName]) {
            score++;
        }
    }

    let percentage = (score / totalQuestions) * 100;

    let grade = getGrade(percentage);

    let feedback = getFeedback(grade);

    displayResults(score, percentage, grade, feedback);

    saveResults(score, percentage, grade);
}

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


function displayResults(score, percentage, grade, feedback) {

    // Show the result section
    document.getElementById("resultSection").style.display = "block";

    // Update text content
    document.getElementById("scoreDisplay").textContent = score + "/" + totalQuestions;
    document.getElementById("percentageDisplay").textContent = percentage + "%";
    document.getElementById("gradeDisplay").textContent = grade;
    document.getElementById("feedbackDisplay").textContent = feedback;

    // Update progress bar
    let progressBar = document.getElementById("scoreProgressBar");
    progressBar.style.width = percentage + "%";
    progressBar.textContent = percentage + "%";
    progressBar.setAttribute("aria-valuenow", percentage);

    // Change progress bar color based on score
    if (percentage >= 80) {
        progressBar.className = "progress-bar bg-success";
    } else if (percentage >= 60) {
        progressBar.className = "progress-bar bg-warning";
    } else {
        progressBar.className = "progress-bar bg-danger";
    }

    // Change alert color based on score
    let resultAlert = document.getElementById("resultAlert");
    if (percentage >= 80) {
        resultAlert.className = "alert alert-success";
    } else if (percentage >= 60) {
        resultAlert.className = "alert alert-warning";
    } else {
        resultAlert.className = "alert alert-danger";
    }

}


//Save Results to localStorage

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

//Retake Quiz

function retakeQuiz() {

    // Step 1: Clear all radio button selections
    document.getElementById("quizForm").reset();

    // Step 2: Hide the result section
    document.getElementById("resultSection").style.display = "none";

    // Step 3: Scroll back to top of page
    window.scrollTo({ top: 0, behavior: "smooth" });
}



function isPassed(percentage) {
    return percentage >= 50;
}

function calculatePercentage(score, total) {
    return (score / total) * 100;
}


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