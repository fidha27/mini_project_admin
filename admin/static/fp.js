document.addEventListener("DOMContentLoaded", function () {
    fetchFaculty();
});

function editFaculty(facultyId) {
    // Find the faculty list item
    let facultyElement = document.querySelector(`li[data-id='${facultyId}']`);

    if (!facultyElement) {
        console.error("Faculty element not found");
        return;
    }

    // Extract current values
    let name = facultyElement.querySelector(".faculty-name").innerText;
    let penNo = facultyElement.querySelector(".faculty-pen-no").innerText;
    let deptCode = facultyElement.querySelector(".faculty-dept-code").innerText;
    let designation = facultyElement.querySelector(".faculty-designation").innerText;

    // Populate modal with current values
    document.getElementById("editFacultyId").value = facultyId;
    document.getElementById("editName").value = name;
    document.getElementById("editPenNo").value = penNo;
    document.getElementById("editDeptCode").value = deptCode;
    document.getElementById("editDesignation").value = designation;

    // Show modal
    document.getElementById("editFacultyModal").style.display = "block";
}

function updateFaculty() {
    let facultyId = document.getElementById("editFacultyId").value;
    let updatedData = {
        name: document.getElementById("editName").value,
        pen_no: document.getElementById("editPenNo").value,
        dept_code: document.getElementById("editDeptCode").value,
        designation: document.getElementById("editDesignation").value
    };

    fetch(`/update_faculty/${facultyId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);

        // Update faculty list dynamically
        let facultyElement = document.querySelector(`li[data-id='${facultyId}']`);
        facultyElement.querySelector(".faculty-name").innerText = updatedData.name;
        facultyElement.querySelector(".faculty-pen-no").innerText = updatedData.pen_no;
        facultyElement.querySelector(".faculty-dept-code").innerText = updatedData.dept_code;
        facultyElement.querySelector(".faculty-designation").innerText = updatedData.designation;

        closeEditModal();
    })
    .catch(error => console.error("Error updating faculty:", error));
}

function closeEditModal() {
    document.getElementById("editFacultyModal").style.display = "none";
}


// Fetch Faculty based on Department Selection
function fetchFaculty() {
    const department = document.getElementById("departmentSearch").value;
    fetch(`/get_faculty?department=${department}`)
        .then(response => response.json())
        .then(data => {
            const facultyList = document.getElementById("facultyList");
            facultyList.innerHTML = "";
            data.forEach(faculty => {
                facultyList.innerHTML += `
                    <li>
                        <span>${faculty.name} (${faculty.pen_no})</span>
                        <button onclick="editFaculty('${faculty._id}')">Edit</button>
                        <button onclick="deleteFaculty('${faculty._id}')">Delete</button>
                        <button onclick="generatePassword('${faculty._id}')">Generate Password</button>
                    </li>`;
            });
        })
        .catch(error => console.error("Error fetching faculty:", error));
}

function submitFacultyForm() {
    let form = document.getElementById("addFacultyForm");
    let formData = new FormData(form);

    fetch("/add_faculty", {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        alert("Faculty added successfully!"); // Show message
        form.reset(); // Clear the form
    })
    .catch(error => console.error("Error:", error));
}
setTimeout(function() {
    let flashMessages = document.getElementById("flash-messages");
    if (flashMessages) {
        flashMessages.style.transition = "opacity 0.5s";
        flashMessages.style.opacity = "0";
        setTimeout(() => flashMessages.remove(), 500);
    }
}, 3000); 

// Add Faculty
document.getElementById("addFacultyForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(this); // Collect form data

    fetch("/add_faculty", {  // Call the Flask function directly
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("responseMessage").innerText = data.message;
        if (data.success) {
            document.getElementById("addFacultyForm").reset(); // Clear the form if successful
        }
    })
    .catch(error => console.error("Error:", error));
});
// Delete Faculty
function deleteFaculty(facultyId) {
    console.log("Delete faculty:", facultyId);
    if (!confirm("Are you sure you want to delete this faculty?")) return;

    fetch(`/delete_faculty/${facultyId}`, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert("Faculty deleted successfully!");
            fetchFaculty(); // Refresh list
        } else {
            alert(data.error || "Error deleting faculty.");
        }
    })
    .catch(error => console.error("Error deleting faculty:", error));
}

// Upload Faculty CSV
function uploadFacultyCsv() {
    const fileInput = document.getElementById("facultyCsvUpload");
    if (!fileInput.files.length) {
        alert("Please select a CSV file.");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    fetch("/upload_faculty_csv", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        fetchFaculty();
    })
    .catch(error => console.error("Error uploading faculty CSV:", error));
}

// Generate Password
function generatePassword(facultyId) {
    fetch(`/generate_password/${facultyId}`, {
        method: "POST"
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || "Error generating password.");
    })
    .catch(error => console.error("Error generating password:", error));
}

// Generate All Passwords
function generateAllPasswords() {
    fetch("/generate_all_passwords", {
        method: "POST"
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || "Error generating passwords.");
    })
    .catch(error => console.error("Error generating passwords:", error));
}
