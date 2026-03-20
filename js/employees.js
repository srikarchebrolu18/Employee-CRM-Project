// View Employee Details in Modal
function viewEmployee(id) {

    // Get all employees from localStorage
    let allEmployees = getFromStorage("employees");

    if (allEmployees === null) {
        allEmployees = [];
    }

    // Find by employee by ID
    let employee = allEmployees.find(function(emp) {
        return emp.id === id;
    });

    if (!employee) {
        alert("Employee not found!");
        return;
    }

    // Fill the modal with employee's data
    document.getElementById("modalName").textContent = employee.name;
    document.getElementById("modalDepartment").textContent = employee.department;
    document.getElementById("modalRole").textContent = employee.role;
    document.getElementById("modalEmail").textContent = employee.email;

    let statusBadge = document.getElementById("modalStatus");
    if (employee.status === "active") {
        statusBadge.className = "badge bg-success";
        statusBadge.textContent = "Active";
    } else {
        statusBadge.className = "badge bg-secondary";
        statusBadge.textContent = "Inactive";
    }

    //Fill client list using
    let clientList = document.getElementById("modalClients");
    clientList.innerHTML = "";

    employee.clients.forEach(function(client) {
        let li = document.createElement("li");
        li.textContent = client;
        clientList.appendChild(li);
    });

    document.getElementById("modalScore").textContent = employee.performance + "%";

    let progressBar = document.getElementById("modalProgressBar");
    progressBar.style.width = employee.performance + "%";
    progressBar.setAttribute("aria-valuenow", employee.performance);

    if (employee.performance >= 80) {
        progressBar.className = "progress-bar bg-success";
    } else if (employee.performance >= 60) {
        progressBar.className = "progress-bar bg-warning";
    } else {
        progressBar.className = "progress-bar bg-danger";
    }

    saveToStorage("selectedEmployee", id);
}

// Search/Filter Employees

function filterEmployees() {

    let searchText = document.getElementById("searchEmployee").value.toLowerCase();

    let tableBody = document.getElementById("employeeTableBody");
    let rows = tableBody.getElementsByTagName("tr");
    let visibleCount = 0;

    for (let i = 0; i < rows.length; i++) {

        let rowText = rows[i].textContent.toLowerCase();

        if (rowText.includes(searchText)) {
            rows[i].style.display = "";
            visibleCount++;
        } else {
            rows[i].style.display = "none";
        }
    }

    document.getElementById("employeeCount").textContent = visibleCount;
}


// Filter by Category

function filterByCategory(category) {

    // Step 1: Get all table rows
    let tableBody = document.getElementById("employeeTableBody");
    let rows = tableBody.getElementsByTagName("tr");

    let visibleCount = 0;

    for (let i = 0; i < rows.length; i++) {

        // Get the data attributes from the row
        let rowDepartment = rows[i].getAttribute("data-department");
        let rowStatus = rows[i].getAttribute("data-status");

        let shouldShow = false;

        if (category === "all") {
            shouldShow = true;

        } else if (category === "active" || category === "inactive") {
            shouldShow = (rowStatus === category);

        } else {
            shouldShow = (rowDepartment === category);
        }

        if (shouldShow) {
            rows[i].style.display = "";
            visibleCount++;
        } else {
            rows[i].style.display = "none";
        }
    }

    document.getElementById("employeeCount").textContent = visibleCount;

    let allButtons = document.querySelectorAll(".filter-btn");
    allButtons.forEach(function(btn) {
        btn.classList.remove("active");
    });

    // Add "active" class to the clicked button
    // Find button with matching data-filter attribute
    let activeButton = document.querySelector('.filter-btn[data-filter="' + category + '"]');
    if (activeButton) {
        activeButton.classList.add("active");
    }
}


// Add New Employee
function addEmployee() {

    let name = document.getElementById("empName").value;
    let email = document.getElementById("empEmail").value;
    let department = document.getElementById("empDepartment").value;
    let role = document.getElementById("empRole").value;
    let clientsInput = document.getElementById("empClients").value;


    let statusRadio = document.querySelector('input[name="empStatus"]:checked');
    let status = statusRadio ? statusRadio.value : "active";

    if (name === "" || email === "" || department === "" || department === null) {
        alert("Please fill in all required fields!");
        return;
    }

    // existing employees
    let allEmployees = getFromStorage("employees");
    if (allEmployees === null) {
        allEmployees = [];
    }

    // new employee ID
    let maxId = 100;
    allEmployees.forEach(function(emp) {
        if (emp.id > maxId) {
            maxId = emp.id;
        }
    });
    let newId = maxId + 1;

    //new employee object
    let newEmployee = {
        id: newId,
        name: name,
        department: department,
        role: "Employee",
        email: email,
        phone: "+91 00000 00000",
        status: status,
        clients: clientsInput ? clientsInput.split(",").map(c => c.trim()) : [],
        performance: 0
    };

    allEmployees.push(newEmployee);
    saveToStorage("employees", allEmployees);

   // add new row to the table
    let tableBody = document.getElementById("employeeTableBody");

    let statusBadgeHTML = "";
    if (status === "active") {
        statusBadgeHTML = '<span class="badge bg-success"><i class="bi bi-check-circle"></i> Active</span>';
    } else {
        statusBadgeHTML = '<span class="badge bg-secondary"><i class="bi bi-x-circle"></i> Inactive</span>';
    }

    // Create the new row HTML
    let newRow = document.createElement("tr");
    newRow.setAttribute("data-department", department);
    newRow.setAttribute("data-status", status);

    newRow.innerHTML = 
        '<td>' + newId + '</td>' +
        '<td>' +
            '<i class="bi bi-person-circle text-primary"></i> ' +
            '<strong>' + name + '</strong>' +
            '<br><small class="text-muted">' + email + '</small>' +
        '</td>' +
        '<td><span class="badge bg-primary-light text-primary">' + department + '</span></td>' +
        '<td>' + (role || "Employee") + '</td>' +
        '<td>0</td>' +
        '<td>' + statusBadgeHTML + '</td>' +
        '<td>' +
            '<button class="btn btn-sm btn-outline-primary" ' +
                'data-bs-toggle="modal" ' +
                'data-bs-target="#viewEmployeeModal" ' +
                'onclick="viewEmployee(' + newId + ')" ' +
                'title="View Details">' +
                '<i class="bi bi-eye"></i>' +
            '</button>' +
        '</td>';

    // Add the row to the table
    tableBody.appendChild(newRow);

    // update employee count
    let totalRows = tableBody.getElementsByTagName("tr").length;
    document.getElementById("employeeCount").textContent = totalRows;

    document.getElementById("addEmployeeForm").reset();

    let modal = bootstrap.Modal.getInstance(document.getElementById("addEmployeeModal"));
    if (modal) {
        modal.hide();
    }

    alert("Employee " + name + " added successfully!");
}


// Load Employee Table from localStorage

function loadEmployeeTable() {

    if (!existsInStorage("employees")) {
        // These are the same employees from app.js
        let defaultEmployees = [
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
        saveToStorage("employees", defaultEmployees);
    }

    let allEmployees = getFromStorage("employees");

    if (allEmployees === null || allEmployees.length === 0) {
        return;
    }

    let tableBody = document.getElementById("employeeTableBody");

    tableBody.innerHTML = "";

    allEmployees.forEach(function(emp) {

        // Create status badge HTML
        let statusBadgeHTML = "";
        let iconColor = "text-primary";

        if (emp.status === "active") {
            statusBadgeHTML = '<span class="badge bg-success status-badge" ' +
                              'onclick="toggleStatus(this)" ' +
                              'style="cursor: pointer;" ' +
                              'title="Click to toggle status">' +
                              '<i class="bi bi-check-circle"></i> Active</span>';
        } else {
            statusBadgeHTML = '<span class="badge bg-secondary status-badge" ' +
                              'onclick="toggleStatus(this)" ' +
                              'style="cursor: pointer;" ' +
                              'title="Click to toggle status">' +
                              '<i class="bi bi-x-circle"></i> Inactive</span>';
            iconColor = "text-secondary";
        }

        // Create department badge color
        let deptBadgeClass = "bg-primary-light text-primary";
        if (emp.department === "Marketing") {
            deptBadgeClass = "bg-success-light text-success";
        } else if (emp.department === "Support") {
            deptBadgeClass = "bg-warning-light text-warning";
        } else if (emp.department === "HR") {
            deptBadgeClass = "bg-info-light text-info";
        }

        // Create the row
        let row = document.createElement("tr");
        row.setAttribute("data-department", emp.department);
        row.setAttribute("data-status", emp.status);

                row.innerHTML =
            '<td>' + emp.id + '</td>' +
            '<td>' +
                '<i class="bi bi-person-circle ' + iconColor + '"></i> ' +
                '<strong>' + emp.name + '</strong>' +
                '<br><small class="text-muted">' + emp.email + '</small>' +
            '</td>' +
            '<td><span class="badge ' + deptBadgeClass + '">' + emp.department + '</span></td>' +
            '<td>' + emp.role + '</td>' +
            '<td>' + emp.clients.length + '</td>' +
            '<td>' + statusBadgeHTML + '</td>' +
            '<td>' +
                '<button class="btn btn-sm btn-outline-primary" ' +
                    'data-bs-toggle="modal" ' +
                    'data-bs-target="#viewEmployeeModal" ' +
                    'onclick="viewEmployee(' + emp.id + ')" ' +
                    'title="View Details">' +
                    '<i class="bi bi-eye"></i>' +
                '</button>' +
            '</td>';

        // Add row to table
        tableBody.appendChild(row);
    });

    // Update employee count
    document.getElementById("employeeCount").textContent = allEmployees.length;
}


$(document).ready(function() {

    // Load employee table from localStorage
    loadEmployeeTable();

    $("#searchEmployee").on("keyup", function() {
        filterEmployees();
    });

});
