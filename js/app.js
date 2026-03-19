
// Employee Data
const employees = [
    {
        id: 101,
        name: "Rahul Sharma",
        department: "Sales",
        role: "Manager",
        email: "rahul@staffsync.com",
        phone: "+91 98765 43210",
        status: "active",
        clients: ["Tata Motors", "Reliance Industries", "Infosys"],
        performance: 85
    },
    {
        id: 102,
        name: "Ananya Gupta",
        department: "Marketing",
        role: "Executive",
        email: "ananya@staffsync.com",
        phone: "+91 98765 43211",
        status: "active",
        clients: ["Wipro", "HCL Tech"],
        performance: 72
    },
    {
        id: 103,
        name: "Vikram Patel",
        department: "Support",
        role: "Team Lead",
        email: "vikram@staffsync.com",
        phone: "+91 98765 43212",
        status: "active",
        clients: ["Bajaj Auto", "Mahindra", "Hero Motors", "TVS"],
        performance: 60
    },
    {
        id: 104,
        name: "Priya Singh",
        department: "HR",
        role: "HR Specialist",
        email: "priya@staffsync.com",
        phone: "+91 98765 43213",
        status: "inactive",
        clients: ["Internal"],
        performance: 45
    },
    {
        id: 105,
        name: "Deepak Kumar",
        department: "Sales",
        role: "Sales Executive",
        email: "deepak@staffsync.com",
        phone: "+91 98765 43214",
        status: "active",
        clients: ["Godrej", "Asian Paints", "Titan", "Dabur", "ITC", "Nestle"],
        performance: 90
    },
    {
        id: 106,
        name: "Sneha Mehta",
        department: "Marketing",
        role: "Content Lead",
        email: "sneha@staffsync.com",
        phone: "+91 98765 43215",
        status: "inactive",
        clients: ["Zomato", "Swiggy"],
        performance: 55
    }
];

// Find employee by ID
function findEmployeeById(id) {
    return employees.find(function(emp) {
        return emp.id === id;
    });
}

// Save employees to localStorage
function initializeEmployeeData() {
    if (!existsInStorage("employees")) {
        saveToStorage("employees", employees);
    }
}

// Simulate async loading
async function loadDashboard() {

    try {
        $("#totalEmployees").text("...");
        $("#activeEmployees").text("...");
        $("#totalClients").text("...");
        $("#avgPerformance").text("...");

        // ✅ GET FROM LOCAL STORAGE
        let data = getFromStorage("employees");

        if (!data || data.length === 0) return;

        let totalEmps = data.length;

        let activeEmps = data.filter(emp => emp.status === "active").length;

        let totalClients = 0;
        data.forEach(emp => {
            totalClients += emp.clients.length;
        });

        let totalPerformance = 0;
        data.forEach(emp => {
            totalPerformance += emp.performance;
        });

        let avgPerformance = Math.round(totalPerformance / totalEmps);

        $("#totalEmployees").text(totalEmps);
        $("#activeEmployees").text(activeEmps);
        $("#totalClients").text(totalClients);
        $("#avgPerformance").text(avgPerformance + "%");

    } catch (error) {
        console.log("Error loading dashboard: " + error);
    }
}
// Load Dashboard data
async function loadDashboard() {
    try {
        $("#totalEmployees").text("...");
        $("#activeEmployees").text("...");
        $("#totalClients").text("...");
        $("#avgPerformance").text("...");

        let data = await loadEmployeeData();

        let totalEmps = data.length;

        let activeEmps = data.filter(function(emp) {
            return emp.status === "active";
        }).length;

        let totalClients = 0;
        data.forEach(function(emp) {
            totalClients = totalClients + emp.clients.length;
        });

        let totalPerformance = 0;
        data.forEach(function(emp) {
            totalPerformance = totalPerformance + emp.performance;
        });
        let avgPerformance = Math.round(totalPerformance / totalEmps);

        $("#totalEmployees").text(totalEmps);
        $("#activeEmployees").text(activeEmps);
        $("#totalClients").text(totalClients);
        $("#avgPerformance").text(avgPerformance + "%");

    } catch (error) {
        console.log("Error loading dashboard: " + error);
    }
}

// Load Profile data
function loadProfileData() {
    let selectedId = getFromStorage("selectedEmployee");

    if (selectedId === null) {
        selectedId = 101;
    }

    let allEmployees = getFromStorage("employees");

    let employee = allEmployees.find(emp => emp.id === selectedId);
    if (!employee) {
        return;
    }

    document.getElementById("profileName").textContent = employee.name;
    document.getElementById("profileDepartment").textContent = employee.department;
    document.getElementById("profileRole").textContent = employee.role;
    document.getElementById("profileEmail").textContent = employee.email;
    document.getElementById("profilePhone").textContent = employee.phone;

    let statusBadge = document.getElementById("profileStatus");
    if (employee.status === "active") {
        statusBadge.className = "badge bg-success mb-3";
        statusBadge.innerHTML = '<i class="bi bi-check-circle"></i> Active';
    } else {
        statusBadge.className = "badge bg-secondary mb-3";
        statusBadge.innerHTML = '<i class="bi bi-x-circle"></i> Inactive';
    }

    let clientList = document.getElementById("profileClients");
    clientList.innerHTML = "";

    employee.clients.forEach(function(client) {
        let li = document.createElement("li");
        li.textContent = client;
        clientList.appendChild(li);
    });

    document.getElementById("profileClientCount").textContent = employee.clients.length;

    document.getElementById("profilePerformanceValue").textContent = employee.performance + "%";
    let perfBar = document.getElementById("profilePerformanceBar");
    perfBar.style.width = employee.performance + "%";
    perfBar.setAttribute("aria-valuenow", employee.performance);

    if (employee.performance >= 80) {
        perfBar.className = "progress-bar bg-success";
    } else if (employee.performance >= 60) {
        perfBar.className = "progress-bar bg-warning";
    } else {
        perfBar.className = "progress-bar bg-danger";
    }

    let results = employee.assessment;
    if (results !== null) {
        document.getElementById("profileScore").textContent = results.score + "/" + results.total;
        document.getElementById("profilePercentage").textContent = results.percentage + "%";
        document.getElementById("profileGrade").textContent = results.grade;
        document.getElementById("profileAssessmentDate").textContent = results.date;

        let scoreBar = document.getElementById("profileScoreBar");
        scoreBar.style.width = results.percentage + "%";
        scoreBar.textContent = results.percentage + "%";
    }
}


async function loadDashboard() {

    try {
        $("#totalEmployees").text("...");
        $("#activeEmployees").text("...");
        $("#totalClients").text("...");
        $("#avgPerformance").text("...");

        let data = getFromStorage("employees");

        if (!data || data.length === 0) return;

        let totalEmps = data.length;

        let activeEmps = data.filter(emp => emp.status === "active").length;

        let totalClients = 0;
        data.forEach(emp => {
            totalClients += emp.clients.length;
        });

        let totalPerformance = 0;
        data.forEach(emp => {
            totalPerformance += emp.performance;
        });

        let avgPerformance = Math.round(totalPerformance / totalEmps);

        $("#totalEmployees").text(totalEmps);
        $("#activeEmployees").text(activeEmps);
        $("#totalClients").text(totalClients);
        $("#avgPerformance").text(avgPerformance + "%");

    } catch (error) {
        console.log("Error loading dashboard: " + error);
    }
}
// Page Initialization
$(document).ready(function() {
    initializeEmployeeData();

    let currentPage = window.location.pathname;

    if (currentPage.includes("Dashboard")) {
        loadDashboard();
    }

    if (currentPage.includes("Profile")) {
        loadProfileData();
    }
});
